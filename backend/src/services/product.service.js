import { prisma } from "../config/prisma.js";
import { isFullAdminRole } from "../config/constants.js";
import { AppError } from "../errors/app-error.js";
import { decimalToPaise, parseMoneyToPaise, paiseToDecimalString } from "../utils/money.js";
import { sanitizeContent, sanitizeText } from "../utils/sanitize.js";
import { getGlobalPaymentPolicy } from "./payment-policy.service.js";
import { createCategoryNode, listActiveCategories, listActiveCategoryTree, toCategorySlug } from "./category.service.js";
import { listActiveOffers } from "./offer.service.js";
import { listActiveFlashDeals } from "./flash-deal.service.js";
import { listCampaigns } from "./campaign.service.js";
import { syncProductToSearch, removeProductFromSearch, executeSearch } from "./search-engine.service.js";

export { listActiveCategories, listActiveCategoryTree };

// ─── Short-lived offer/deal/campaign cache (10s TTL) ──────────────────────────
// attachActiveOffers is called on every product listing — caching prevents
// 3 repeated DB queries per request when product pages reload frequently.
let _offerCache = null;
let _offerCacheExpiry = 0;
const OFFER_CACHE_TTL_MS = 10_000;

const getCachedOffersData = async () => {
  const now = Date.now();
  if (_offerCache && now < _offerCacheExpiry) return _offerCache;
  const [offers, flashDeals, allCampaigns] = await Promise.all([
    listActiveOffers(),
    listActiveFlashDeals().catch(() => []),
    listCampaigns({ activeOnly: true }).catch(() => ({ campaigns: [] })),
  ]);
  _offerCache = { offers, flashDeals, campaigns: Array.isArray(allCampaigns?.campaigns) ? allCampaigns.campaigns : [] };
  _offerCacheExpiry = now + OFFER_CACHE_TTL_MS;
  return _offerCache;
};

export const invalidateOfferCache = () => { _offerCacheExpiry = 0; _offerCache = null; };


const SUPPORTED_PRODUCT_SORTS = new Set(["latest", "price_asc", "price_desc", "name_asc", "name_desc"]);

const toProductSlug = (value) =>
  sanitizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeOptionalText = (value, maxLength) => {
  if (value === undefined) return undefined;
  const normalized = sanitizeText(value);
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
};

const resolveProductSlug = async ({ productId = null, name, slug, fallbackSlug = null }) => {
  const nextSlug = toProductSlug(slug || fallbackSlug || name || "");
  if (!nextSlug) return null;

  const existing = await prisma.product.findFirst({
    where: {
      slug: nextSlug,
      ...(productId ? { id: { not: productId } } : {}),
    },
    select: { id: true },
  });

  if (existing) {
    throw new AppError("Product slug already exists.", 409, "PRODUCT_SLUG_ALREADY_EXISTS");
  }

  return nextSlug;
};

export const enforceProductPaymentRules = async ({
  isDigital,
  paymentOnlineOnly,
  paymentAllowCOD,
  paymentMinCODPrice,
}) => {
  const globalPolicy = await getGlobalPaymentPolicy();

  if (globalPolicy.onlineOnly && paymentAllowCOD) {
    throw new AppError("Global policy is online-only. COD cannot be enabled.", 400, "GLOBAL_POLICY_ONLINE_ONLY");
  }

  if (!globalPolicy.allowCOD && paymentAllowCOD) {
    throw new AppError("Global policy does not allow COD.", 400, "GLOBAL_POLICY_COD_DISABLED");
  }

  if (globalPolicy.forceDigitalOnline && isDigital && paymentAllowCOD) {
    throw new AppError("Digital products must be online-only by global policy.", 400, "DIGITAL_PRODUCT_COD_NOT_ALLOWED");
  }

  if (isDigital && paymentAllowCOD) {
    throw new AppError("Digital products must be online-only.", 400, "DIGITAL_PRODUCT_COD_NOT_ALLOWED");
  }
  if (paymentOnlineOnly && paymentAllowCOD) {
    throw new AppError("onlineOnly products cannot allow COD.", 400, "INVALID_PAYMENT_RULES");
  }
  if (paymentAllowCOD && paymentMinCODPrice !== undefined && paymentMinCODPrice !== null) {
    const minPaise = parseMoneyToPaise(paymentMinCODPrice, "minCODPrice");
    if (minPaise < 100) {
      throw new AppError("minCODPrice must be at least 1.00.", 400, "INVALID_MIN_COD_PRICE");
    }
    if (globalPolicy.minCODPrice && minPaise < decimalToPaise(globalPolicy.minCODPrice)) {
      throw new AppError(
        `minCODPrice must be at least ${globalPolicy.minCODPrice} due to global policy.`,
        400,
        "GLOBAL_POLICY_MIN_COD_PRICE",
      );
    }
  }
};

export const createCategory = async ({ name }) => {
  return createCategoryNode({ name });
};

const getNormalizedProductSort = (value) => {
  const normalized = sanitizeText(value || "").toLowerCase();
  return SUPPORTED_PRODUCT_SORTS.has(normalized) ? normalized : "latest";
};

const getProductStartingPrice = (product) => {
  const prices = (Array.isArray(product?.variants) ? product.variants : [])
    .map((variant) => Number(variant?.price))
    .filter((value) => Number.isFinite(value));

  if (!prices.length) return Number.POSITIVE_INFINITY;
  return Math.min(...prices);
};

const sortProducts = (products, sort) => {
  const normalizedSort = getNormalizedProductSort(sort);
  const sorted = [...products];

  sorted.sort((left, right) => {
    if (normalizedSort === "name_asc" || normalizedSort === "name_desc") {
      const nameCompare = String(left?.name || "").localeCompare(String(right?.name || ""), "en", {
        sensitivity: "base",
      });
      if (nameCompare !== 0) {
        return normalizedSort === "name_asc" ? nameCompare : -nameCompare;
      }
    }

    if (normalizedSort === "price_asc" || normalizedSort === "price_desc") {
      const priceCompare = getProductStartingPrice(left) - getProductStartingPrice(right);
      if (priceCompare !== 0) {
        return normalizedSort === "price_asc" ? priceCompare : -priceCompare;
      }
    }

    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });

  return sorted;
};

const normalizeOfferForProduct = (offer) =>
  offer
    ? {
        id: offer.id,
        title: offer.title,
        description: offer.description,
        code: offer.code,
        discountPercent: offer.discountPercent,
        endDate: offer.endDate,
        categoryId: offer.categoryId,
        category: offer.category,
      }
    : null;

export const attachActiveOffers = async (products) => {
  if (!products.length) return products;

  const { offers, flashDeals, campaigns } = await getCachedOffersData();

  return products.map((product) => {
    let bestDeal = null;
    let maxDiscount = 0;

    // Check generic offers
    const bestOffer =
      offers.find((offer) => offer.categoryId && offer.categoryId === product.categoryId) ??
      offers.find((offer) => !offer.categoryId) ??
      null;

    if (bestOffer && bestOffer.discountPercent > maxDiscount) {
      maxDiscount = bestOffer.discountPercent;
      bestDeal = normalizeOfferForProduct(bestOffer);
    }

    // Check flash deals
    const flashDeal = flashDeals.find(fd => fd.productId === product.id);
    if (flashDeal) {
      let fdDiscountPercent = 0;
      if (flashDeal.discountType === 'PERCENTAGE') {
        fdDiscountPercent = Number(flashDeal.discountValue);
      } else if (flashDeal.discountType === 'FIXED') {
        const basePrice = product.variants?.[0]?.price ? Number(product.variants[0].price) : 0;
        if (basePrice > 0) fdDiscountPercent = (Number(flashDeal.discountValue) / basePrice) * 100;
      }
      
      if (fdDiscountPercent > maxDiscount) {
        bestDeal = {
          id: flashDeal.id,
          code: 'FLASH-DEAL',
          discountPercent: Math.min(100, Math.round(fdDiscountPercent)),
          endDate: flashDeal.endDate,
          categoryId: null,
          category: null,
          type: 'flash-deal'
        };
      }
    }

    // Check Hero Campaigns
    const activeCampaign = campaigns.find(c => 
      c.productId === product.id || 
      (c.linkUrl && (c.linkUrl.includes(`/product/${product.id}`) || c.linkUrl.includes(`/product/${product.slug}`)))
    );

    return {
      ...product,
      activeOffer: bestDeal,
      activeCampaign: activeCampaign || null
    };
  });
};

const collectDescendantCategoryIds = (categories, rootId) => {
  const ids = [];
  const queue = [rootId];
  const visited = new Set([rootId]);

  while (queue.length > 0) {
    const currentId = queue.shift();
    ids.push(currentId);

    for (const category of categories) {
      if (category.parentId === currentId) {
        if (!visited.has(category.id)) {
          visited.add(category.id);
          queue.push(category.id);
        }
      }
    }
  }

  return ids;
};

// ─── Category tree cache (30s TTL) ───────────────────────────────────────────
let _catCache = null;
let _catCacheExpiry = 0;
const CAT_CACHE_TTL_MS = 30_000;

const getCachedCategories = async () => {
  const now = Date.now();
  if (_catCache && now < _catCacheExpiry) return _catCache;
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, parentId: true, slug: true },
  });
  _catCache = rows;
  _catCacheExpiry = now + CAT_CACHE_TTL_MS;
  return rows;
};

export const invalidateCategoryCache = () => { _catCacheExpiry = 0; _catCache = null; };

const resolveCategoryFilterIds = async ({ categorySlug, subcategorySlug }) => {
  const normalizedCategorySlug = categorySlug ? toCategorySlug(categorySlug) : "";
  const normalizedSubcategorySlug = subcategorySlug ? toCategorySlug(subcategorySlug) : "";

  if (!normalizedCategorySlug && !normalizedSubcategorySlug) {
    return null;
  }

  const categories = await getCachedCategories();

  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const rootCategory = normalizedCategorySlug ? categoryBySlug.get(normalizedCategorySlug) ?? null : null;
  const subcategory = normalizedSubcategorySlug ? categoryBySlug.get(normalizedSubcategorySlug) ?? null : null;

  if (normalizedCategorySlug && !rootCategory) return [];
  if (normalizedSubcategorySlug && !subcategory) return [];

  if (rootCategory && subcategory) {
    const descendants = new Set(collectDescendantCategoryIds(categories, rootCategory.id));
    if (!descendants.has(subcategory.id)) {
      return [];
    }
    return collectDescendantCategoryIds(categories, subcategory.id);
  }

  if (subcategory) {
    return collectDescendantCategoryIds(categories, subcategory.id);
  }

  return collectDescendantCategoryIds(categories, rootCategory.id);
};

export const searchProducts = async ({ q, categorySlug, subcategorySlug, sort, minPrice, maxPrice, page, pageSize, ids }) => {
  const query = q === undefined || q === null ? "" : sanitizeText(q);
  if (query.length > 80) {
    throw new AppError("Search term must be at most 80 characters.", 400, "INVALID_SEARCH_TERM");
  }
  const idArray = ids ? ids.split(',').filter(Boolean) : [];
  const normalizedPage = Math.max(1, Number(page ?? 1));
  const normalizedPageSize = Math.min(50, Math.max(1, Number(pageSize ?? 20)));
  const normalizedSort = getNormalizedProductSort(sort);
  const categoryIds = await resolveCategoryFilterIds({ categorySlug, subcategorySlug });
  const minPricePaise = minPrice === undefined || minPrice === null ? null : parseMoneyToPaise(minPrice, "minPrice");
  const maxPricePaise = maxPrice === undefined || maxPrice === null ? null : parseMoneyToPaise(maxPrice, "maxPrice");

  if (minPricePaise !== null && maxPricePaise !== null && minPricePaise > maxPricePaise) {
    throw new AppError("minPrice must be less than or equal to maxPrice.", 400, "INVALID_PRICE_RANGE");
  }

  if (Array.isArray(categoryIds) && categoryIds.length === 0) {
    return { products: [], total: 0 };
  }

  const variantPriceFilter = {
    ...(minPricePaise !== null ? { gte: paiseToDecimalString(minPricePaise) } : {}),
    ...(maxPricePaise !== null ? { lte: paiseToDecimalString(maxPricePaise) } : {}),
  };

  const variantWhere = {
    isActive: true,
    ...(Object.keys(variantPriceFilter).length ? { price: variantPriceFilter } : {}),
  };

  const where = {
    isActive: true,
    ...(idArray.length > 0 ? { id: { in: idArray } } : {}),
    variants: {
      some: variantWhere,
    },
    ...(Array.isArray(categoryIds)
      ? {
          categoryId: { in: categoryIds },
        }
      : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { shortDescription: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const isPriceSort = normalizedSort === "price_asc" || normalizedSort === "price_desc";

  // Attempt to use the Enterprise Search Engine (Meilisearch)
  const meiliSort = normalizedSort === "price_asc" ? "price:asc" :
                    normalizedSort === "price_desc" ? "price:desc" :
                    normalizedSort === "name_asc" ? "name:asc" :
                    normalizedSort === "name_desc" ? "name:desc" : "updatedAt:desc";

  let meiliResults = null;
  if (idArray.length === 0) {
    meiliResults = await executeSearch({
      query,
      filters: {
        categoryId: categoryIds,
        minPrice: minPricePaise ? minPricePaise / 100 : null,
        maxPrice: maxPricePaise ? maxPricePaise / 100 : null,
      },
      sort: meiliSort,
      offset: (normalizedPage - 1) * normalizedPageSize,
      limit: normalizedPageSize
    });
  }

  const include = {
    category: true,
    variants: { where: { isActive: true } },
    images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }] },
    lister: { select: { id: true, name: true } },
  };

  if (meiliResults) {
    const total = meiliResults.total;
    let pagedProducts = [];
    if (meiliResults.productIds.length > 0) {
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: meiliResults.productIds } },
        include
      });
      // Preserve Meilisearch sorting order
      pagedProducts = meiliResults.productIds
        .map(id => dbProducts.find(p => p.id === id))
        .filter(Boolean);
    }
    return { products: await attachActiveOffers(pagedProducts), total };
  }

  // Fallback if Meilisearch fails
  const orderBy = !isPriceSort
    ? normalizedSort === "name_asc"
      ? { name: "asc" }
      : normalizedSort === "name_desc"
      ? { name: "desc" }
      : { updatedAt: "desc" }
    : undefined;

  if (isPriceSort) {
    const allProducts = await prisma.product.findMany({ where, include });
    const sortedProducts = sortProducts(allProducts, normalizedSort);
    const total = sortedProducts.length;
    const pagedProducts = sortedProducts.slice((normalizedPage - 1) * normalizedPageSize, normalizedPage * normalizedPageSize);
    return { products: await attachActiveOffers(pagedProducts), total };
  }

  const [total, pagedProducts] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include,
      orderBy,
      skip: (normalizedPage - 1) * normalizedPageSize,
      take: normalizedPageSize,
    })
  ]);

  return { products: await attachActiveOffers(pagedProducts), total };
};

export const getProductById = async ({ productId }) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      },
      lister: {
        select: { id: true, name: true },
      },
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!product || !product.isActive) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }

  const [productWithOffer] = await attachActiveOffers([product]);
  return productWithOffer;
};

export const listRelatedProducts = async ({ productId, limit = 4 }) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      categoryId: true,
      category: {
        select: {
          id: true,
          parentId: true,
        },
      },
    },
  });

  if (!product) throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");

  const relatedWhere = {
    id: { not: product.id },
    isActive: true,
    OR: [
      { categoryId: product.categoryId },
      ...(product.category?.parentId
        ? [
            {
              category: {
                parentId: product.category.parentId,
              },
            },
          ]
        : []),
    ],
  };

  const relatedProducts = await prisma.product.findMany({
    where: relatedWhere,
    include: {
      category: true,
      variants: {
        where: { isActive: true },
      },
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      },
      lister: {
        select: { id: true, name: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: Math.max(1, Math.min(8, Number(limit || 4))),
  });
  return attachActiveOffers(relatedProducts);
};

export const createProduct = async ({ userId, input }) => {
  await enforceProductPaymentRules(input);
  const resolvedSlug = await resolveProductSlug({
    name: input.name,
    slug: input.slug,
  });
  const variants = input.variants.map((variant) => {
    const paise = parseMoneyToPaise(variant.price, "variant.price");
    const compareAtPaise = variant.compareAtPrice ? parseMoneyToPaise(variant.compareAtPrice, "variant.compareAtPrice") : null;
    return {
      sku: sanitizeText(variant.sku),
      title: sanitizeText(variant.title),
      attributes: sanitizeContent(variant.attributes),
      price: paiseToDecimalString(paise),
      compareAtPrice: compareAtPaise ? paiseToDecimalString(compareAtPaise) : null,
      stock: variant.stock,
    };
  });

  return prisma.product.create({
    data: {
      listerId: userId,
      categoryId: input.categoryId,
      name: sanitizeText(input.name),
      slug: resolvedSlug,
      shortDescription: normalizeOptionalText(input.shortDescription, 220),
      description: sanitizeText(input.description),
      seoTitle: normalizeOptionalText(input.seoTitle, 160),
      seoDescription: normalizeOptionalText(input.seoDescription, 320),
      isDigital: input.isDigital,
      paymentOnlineOnly: input.paymentOnlineOnly,
      paymentAllowCOD: input.paymentAllowCOD,
      paymentMinCODPrice:
        input.paymentMinCODPrice !== undefined && input.paymentMinCODPrice !== null
          ? paiseToDecimalString(parseMoneyToPaise(input.paymentMinCODPrice, "paymentMinCODPrice"))
          : null,
      variants: {
        create: variants,
      },
    },
    include: {
      category: true,
      variants: true,
    },
  });
  
  await syncProductToSearch(newProduct);
  return newProduct;
};

export const updateProduct = async ({ productId, input, actor }) => {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!existing) throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  if (!isFullAdminRole(actor.role) && existing.listerId !== actor.id) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }

  const merged = {
    isDigital: input.isDigital ?? existing.isDigital,
    paymentOnlineOnly: input.paymentOnlineOnly ?? existing.paymentOnlineOnly,
    paymentAllowCOD: input.paymentAllowCOD ?? existing.paymentAllowCOD,
    paymentMinCODPrice: input.paymentMinCODPrice ?? existing.paymentMinCODPrice,
  };
  await enforceProductPaymentRules(merged);
  const resolvedSlug = await resolveProductSlug({
    productId,
    name: input.name ?? existing.name,
    slug: input.slug,
    fallbackSlug: existing.slug,
  });

  return prisma.product.update({
    where: { id: productId },
    data: {
      ...(input.name ? { name: sanitizeText(input.name) } : {}),
      ...(input.slug !== undefined || input.name !== undefined || existing.slug
        ? { slug: resolvedSlug }
        : {}),
      ...(input.shortDescription !== undefined
        ? { shortDescription: normalizeOptionalText(input.shortDescription, 220) }
        : {}),
      ...(input.description ? { description: sanitizeText(input.description) } : {}),
      ...(input.seoTitle !== undefined ? { seoTitle: normalizeOptionalText(input.seoTitle, 160) } : {}),
      ...(input.seoDescription !== undefined
        ? { seoDescription: normalizeOptionalText(input.seoDescription, 320) }
        : {}),
      ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      ...(input.isDigital !== undefined ? { isDigital: input.isDigital } : {}),
      ...(input.paymentOnlineOnly !== undefined ? { paymentOnlineOnly: input.paymentOnlineOnly } : {}),
      ...(input.paymentAllowCOD !== undefined ? { paymentAllowCOD: input.paymentAllowCOD } : {}),
      ...(input.paymentMinCODPrice !== undefined
        ? {
            paymentMinCODPrice:
              input.paymentMinCODPrice === null
                ? null
                : paiseToDecimalString(parseMoneyToPaise(input.paymentMinCODPrice, "paymentMinCODPrice")),
          }
        : {}),
    },
    include: {
      category: true,
      variants: true,
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });
  
  await syncProductToSearch(updated);
  return updated;
};

export const deactivateProduct = async ({ productId, actor }) => {
  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  if (!isFullAdminRole(actor.role) && existing.listerId !== actor.id) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }
  const deactivated = await prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
    include: { category: true, variants: true }
  });
  
  await syncProductToSearch(deactivated);
  return deactivated;
};

export const updateVariantStock = async ({ variantId, stock, actor }) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true },
  });
  if (!variant) throw new AppError("Variant not found.", 404, "VARIANT_NOT_FOUND");
  if (!isFullAdminRole(actor.role) && variant.product.listerId !== actor.id) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN");
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw new AppError("Stock must be a non-negative integer.", 400, "INVALID_STOCK");
  }
  return prisma.productVariant.update({
    where: { id: variantId },
    data: { stock },
  });
};
