const CATEGORY_ICON_MAP = {
  grocery: "local_grocery_store",
  groceries: "local_grocery_store",
  staples: "pantry",
  grains: "nutrition",
  fruits: "nutrition",
  vegetables: "eco",
  food: "restaurant",
  kitchen: "flatware",
  ready: "soup_kitchen",
  cook: "ramen_dining",
  hardware: "construction",
  electronics: "devices",
  fashion: "checkroom",
  apparel: "checkroom",
  home: "chair_alt",
  living: "weekend",
  essentials: "shopping_basket",
  daily: "shopping_basket",
};

export const pickCategoryIcon = (category) => {
  if (category?.iconName) {
    return String(category.iconName);
  }

  const slug = String(category?.slug ?? "").toLowerCase();
  const parts = slug.split("-");

  for (const part of [slug, ...parts]) {
    if (CATEGORY_ICON_MAP[part]) {
      return CATEGORY_ICON_MAP[part];
    }
  }

  return "inventory_2";
};

export const flattenCategoryTree = (categories = []) => {
  const output = [];

  for (const category of categories) {
    output.push(category);
    if (Array.isArray(category?.children) && category.children.length > 0) {
      output.push(...flattenCategoryTree(category.children));
    }
  }

  return output;
};

export const findCategoryNodeBySlug = (categories = [], slug = "") => {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!normalized) return null;

  for (const category of categories) {
    if (String(category?.slug || "").toLowerCase() === normalized) {
      return category;
    }
    if (Array.isArray(category?.children) && category.children.length > 0) {
      const nested = findCategoryNodeBySlug(category.children, normalized);
      if (nested) return nested;
    }
  }

  return null;
};

export const findCategoryPathById = (categories = [], categoryId) => {
  if (!categoryId) return [];

  for (const category of categories) {
    if (category.id === categoryId) {
      return [category];
    }

    if (Array.isArray(category?.children) && category.children.length > 0) {
      const nested = findCategoryPathById(category.children, categoryId);
      if (nested.length) {
        return [category, ...nested];
      }
    }
  }

  return [];
};

export const getMinVariantPrice = (product) => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const prices = variants
    .map((variant) => Number(variant?.price))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!prices.length) {
    return null;
  }

  return Math.min(...prices);
};

export const getMinCompareAtPrice = (product) => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const prices = variants
    .map((variant) => Number(variant?.compareAtPrice))
    .filter((value) => Number.isFinite(value) && value > 0);

  if (!prices.length) {
    return null;
  }

  return Math.max(...prices);
};

export const getTotalStock = (product) => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  return variants.reduce((sum, variant) => sum + Math.max(0, Number(variant?.stock ?? 0)), 0);
};

export const getProductImageUrl = (product) => {
  return product?.thumbnailImageUrl || product?.images?.[0]?.url || null;
};

export const formatCatalogPrice = (
  value,
  { locale = "en-IN", currency = "INR", maximumFractionDigits = 0, fallback = "Price on request" } = {},
) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return fallback;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(number);
};
