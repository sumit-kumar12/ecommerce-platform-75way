import { z } from "zod";
import {
  createCategory,
  createProduct,
  deactivateProduct,
  getProductById,
  listActiveCategoryTree,
  listActiveCategories,
  listRelatedProducts,
  searchProducts,
  updateProduct,
  updateVariantStock,
} from "../services/product.service.js";
import { buildProductMediaAbsoluteUrl } from "../utils/product-media.js";

const variantSchema = z.object({
  sku: z.string().min(3).max(64),
  title: z.string().min(1).max(120),
  attributes: z.record(z.union([z.string(), z.number(), z.boolean()])),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
});

const optionalSlugSchema = z.preprocess(
  (value) => (typeof value === "string" && !value.trim() ? undefined : value),
  z.string().min(3).max(180).optional(),
);

const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(3).max(150),
  slug: optionalSlugSchema,
  shortDescription: z.string().max(220).optional(),
  description: z.string().min(10).max(5000),
  seoTitle: z.string().max(160).optional(),
  seoDescription: z.string().max(320).optional(),
  isDigital: z.boolean(),
  paymentOnlineOnly: z.boolean(),
  paymentAllowCOD: z.boolean(),
  paymentMinCODPrice: z.number().positive().nullable().optional(),
  variants: z.array(variantSchema).min(1).max(100),
});

const updateProductSchema = createProductSchema.partial();

const stockUpdateSchema = z.object({
  stock: z.number().int().min(0),
});

const createCategorySchema = z.object({
  name: z.string().min(2).max(120),
});

const searchQuerySchema = z.object({
  q: z.string().max(80).optional(),
  categorySlug: z.string().max(120).optional(),
  subcategorySlug: z.string().max(120).optional(),
  sort: z.enum(["latest", "price_asc", "price_desc", "name_asc", "name_desc"]).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(50).optional(),
  ids: z.string().optional(),
});
const productParamSchema = z.object({
  productId: z.string().uuid(),
});
const relatedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(8).optional(),
});
const variantParamSchema = z.object({
  variantId: z.string().uuid(),
});

const serializeProductImages = (req, images) =>
  (Array.isArray(images) ? images : []).map((image) => ({
    id: image.id,
    url: buildProductMediaAbsoluteUrl({ req, storageKey: image.storageKey }),
    isPrimary: image.isPrimary,
    altText: image.altText,
    caption: image.caption,
    sortOrder: image.sortOrder,
    mimeType: image.mimeType,
  }));

export const serializeProductPayload = (req, product) => {
  const images = serializeProductImages(req, product.images);
  const primary = images.find((image) => image.isPrimary) ?? images[0] ?? null;
  return {
    ...product,
    images,
    thumbnailImageUrl: primary?.url ?? null,
  };
};

export const createCategoryController = async (req, res) => {
  const input = createCategorySchema.parse(req.body);
  const category = await createCategory(input);
  res.status(201).json({ category });
};

export const listCategoriesController = async (_req, res) => {
  const categories = await listActiveCategories();
  res.status(200).json({ categories });
};

export const listCategoryTreeController = async (_req, res) => {
  const categories = await listActiveCategoryTree();
  res.status(200).json({ categories });
};

export const createProductController = async (req, res) => {
  const input = createProductSchema.parse(req.body);
  const product = await createProduct({ userId: req.user.id, input });
  res.status(201).json({ product: serializeProductPayload(req, product) });
};

export const updateProductController = async (req, res) => {
  const params = productParamSchema.parse(req.params);
  const input = updateProductSchema.parse(req.body);
  const product = await updateProduct({
    productId: params.productId,
    input,
    actor: req.user,
  });
  res.status(200).json({ product: serializeProductPayload(req, product) });
};

export const deactivateProductController = async (req, res) => {
  const params = productParamSchema.parse(req.params);
  const product = await deactivateProduct({
    productId: params.productId,
    actor: req.user,
  });
  res.status(200).json({ product });
};

export const updateVariantStockController = async (req, res) => {
  const params = variantParamSchema.parse(req.params);
  const input = stockUpdateSchema.parse(req.body);
  const variant = await updateVariantStock({
    variantId: params.variantId,
    stock: input.stock,
    actor: req.user,
  });
  res.status(200).json({ variant });
};

export const searchProductsController = async (req, res) => {
  const query = searchQuerySchema.parse(req.query);
  const result = await searchProducts(query);
  res.status(200).json({
    ...result,
    products: (result.products ?? []).map((product) => serializeProductPayload(req, product)),
  });
};

export const getProductByIdController = async (req, res) => {
  const params = productParamSchema.parse(req.params);
  const product = await getProductById({ productId: params.productId });
  res.status(200).json({ product: serializeProductPayload(req, product) });
};

export const listRelatedProductsController = async (req, res) => {
  const params = productParamSchema.parse(req.params);
  const query = relatedQuerySchema.parse(req.query);
  const products = await listRelatedProducts({ productId: params.productId, limit: query.limit ?? 4 });
  res.status(200).json({
    products: products.map((product) => serializeProductPayload(req, product)),
  });
};
