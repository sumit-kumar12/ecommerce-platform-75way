import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { sanitizeText } from "../utils/sanitize.js";

const categorySelect = {
  id: true,
  parentId: true,
  name: true,
  slug: true,
  description: true,
  iconName: true,
  sortOrder: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      children: true,
      products: true,
    },
  },
};

export const toCategorySlug = (value) =>
  sanitizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeCategoryInput = (input) => ({
  name: sanitizeText(input.name),
  description: input.description ? sanitizeText(input.description) : null,
  iconName: input.iconName ? sanitizeText(input.iconName) : null,
  parentId: input.parentId ?? null,
  sortOrder: Number.isInteger(input.sortOrder) ? input.sortOrder : 0,
  isActive: input.isActive ?? true,
});

const ensureParentExists = async (parentId) => {
  if (!parentId) return null;
  const parent = await prisma.category.findUnique({ where: { id: parentId } });
  if (!parent) throw new AppError("Parent category not found.", 404, "PARENT_CATEGORY_NOT_FOUND");
  return parent;
};

const buildTree = (rows) => {
  const map = new Map();
  for (const row of rows) {
    map.set(row.id, { ...row, children: [] });
  }

  const roots = [];
  for (const row of rows) {
    const node = map.get(row.id);
    if (row.parentId && map.has(row.parentId)) {
      map.get(row.parentId).children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};

export const listCategoriesOrdered = async (where = {}) =>
  prisma.category.findMany({
    where,
    select: categorySelect,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

const assertNoCycle = (categoryId, parentId, rows) => {
  if (!parentId) return;
  if (categoryId === parentId) {
    throw new AppError("A category cannot be its own parent.", 400, "CATEGORY_PARENT_INVALID");
  }

  const parentMap = new Map(rows.map((row) => [row.id, row.parentId]));
  let current = parentId;
  while (current) {
    if (current === categoryId) {
      throw new AppError("A category cannot move inside its own subtree.", 400, "CATEGORY_CYCLE_DETECTED");
    }
    current = parentMap.get(current) ?? null;
  }
};

export const createCategoryNode = async (input) => {
  const normalized = normalizeCategoryInput(input);
  const slug = toCategorySlug(normalized.name);
  if (!slug) throw new AppError("Invalid category name.", 400, "INVALID_CATEGORY_NAME");

  await ensureParentExists(normalized.parentId);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    throw new AppError("Category already exists.", 409, "CATEGORY_ALREADY_EXISTS");
  }

  return prisma.category.create({
    data: {
      name: normalized.name,
      slug,
      description: normalized.description,
      iconName: normalized.iconName,
      parentId: normalized.parentId,
      sortOrder: normalized.sortOrder,
      isActive: normalized.isActive,
    },
    select: categorySelect,
  });
};

export const listActiveCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, parentId: true, name: true, slug: true },
  });
  return categories;
};

export const listActiveCategoryTree = async () => buildTree(await listCategoriesOrdered({ isActive: true }));

export const listAdminCategoryTree = async () => buildTree(await listCategoriesOrdered());

export const updateCategoryNode = async ({ categoryId, input }) => {
  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");

  const rows = await prisma.category.findMany({ select: { id: true, parentId: true } });
  const nextParentId = input.parentId === undefined ? existing.parentId : input.parentId;
  await ensureParentExists(nextParentId);
  assertNoCycle(categoryId, nextParentId, rows);

  const nextName = input.name !== undefined ? sanitizeText(input.name) : existing.name;
  const nextSlug = toCategorySlug(nextName);
  if (!nextSlug) throw new AppError("Invalid category name.", 400, "INVALID_CATEGORY_NAME");

  const conflicting = await prisma.category.findUnique({ where: { slug: nextSlug } });
  if (conflicting && conflicting.id !== categoryId) {
    throw new AppError("Category already exists.", 409, "CATEGORY_ALREADY_EXISTS");
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(input.name !== undefined ? { name: nextName, slug: nextSlug } : {}),
      ...(input.description !== undefined ? { description: input.description ? sanitizeText(input.description) : null } : {}),
      ...(input.iconName !== undefined ? { iconName: input.iconName ? sanitizeText(input.iconName) : null } : {}),
      ...(input.parentId !== undefined ? { parentId: nextParentId } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
    select: categorySelect,
  });
};

export const deleteCategoryNode = async ({ categoryId }) => {
  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { children: true, products: true } } },
  });
  if (!existing) throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
  if (existing._count.children > 0) {
    throw new AppError("Delete or move child categories first.", 400, "CATEGORY_HAS_CHILDREN");
  }
  if (existing._count.products > 0) {
    throw new AppError("Delete or reassign products before removing the category.", 400, "CATEGORY_HAS_PRODUCTS");
  }
  await prisma.category.delete({ where: { id: categoryId } });
  return { ok: true };
};

export const reorderCategoryNodes = async ({ items }) => {
  const ids = items.map((item) => item.id);
  const rows = await prisma.category.findMany({ where: { id: { in: ids } }, select: { id: true, parentId: true } });
  if (rows.length !== ids.length) {
    throw new AppError("One or more categories were not found.", 404, "CATEGORY_NOT_FOUND");
  }

  for (const item of items) {
    await ensureParentExists(item.parentId ?? null);
    assertNoCycle(item.id, item.parentId ?? null, rows);
  }

  await prisma.$transaction(
    items.map((item, index) =>
      prisma.category.update({
        where: { id: item.id },
        data: {
          parentId: item.parentId ?? null,
          sortOrder: item.sortOrder ?? index,
        },
      }),
    ),
  );

  return listAdminCategoryTree();
};
