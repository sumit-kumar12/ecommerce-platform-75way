import fs from "node:fs/promises";
import path from "node:path";
import { productMediaDiskRoot } from "./product-media.js";

const CATEGORY_PALETTES = {
  grocery: { base: "#11243d", accent: "#69e0ff", highlight: "#ffd166", surface: "#193358" },
  "staples-grains": { base: "#11243d", accent: "#69e0ff", highlight: "#ffd166", surface: "#193358" },
  "fruits-vegetables": { base: "#11243d", accent: "#69e0ff", highlight: "#ffd166", surface: "#193358" },
  food: { base: "#261435", accent: "#ff7c6d", highlight: "#ffe082", surface: "#38204d" },
  "snacks-beverages": { base: "#261435", accent: "#ff7c6d", highlight: "#ffe082", surface: "#38204d" },
  "ready-to-cook": { base: "#261435", accent: "#ff7c6d", highlight: "#ffe082", surface: "#38204d" },
  hardware: { base: "#182430", accent: "#8bd3ff", highlight: "#ffc857", surface: "#223446" },
  "tools-electrical": { base: "#182430", accent: "#8bd3ff", highlight: "#ffc857", surface: "#223446" },
  "plumbing-fittings": { base: "#182430", accent: "#8bd3ff", highlight: "#ffc857", surface: "#223446" },
  "home-items": { base: "#1f2143", accent: "#b79cff", highlight: "#ffe29a", surface: "#2c2f5a" },
  "kitchen-dining": { base: "#1f2143", accent: "#b79cff", highlight: "#ffe29a", surface: "#2c2f5a" },
  "home-textiles": { base: "#1f2143", accent: "#b79cff", highlight: "#ffe29a", surface: "#2c2f5a" },
  "daily-essentials": { base: "#13302f", accent: "#63f0d6", highlight: "#ffd1dc", surface: "#1d4544" },
  "personal-care": { base: "#13302f", accent: "#63f0d6", highlight: "#ffd1dc", surface: "#1d4544" },
  "household-needs": { base: "#13302f", accent: "#63f0d6", highlight: "#ffd1dc", surface: "#1d4544" },
  default: { base: "#171c34", accent: "#8ea3ff", highlight: "#ffd166", surface: "#23294a" },
};

const escapeXml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const splitTitleLines = (value, maxLineLength = 26, maxLines = 3) => {
  const words = String(value ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return ["Marketplace item"];

  const lines = [];
  let current = words.shift();

  for (const word of words) {
    const next = `${current} ${word}`;
    if (next.length <= maxLineLength) current = next;
    else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }

  if (lines.length < maxLines && current) lines.push(current);
  if (lines.length === maxLines && words.length > 0) {
    lines[maxLines - 1] = `${lines[maxLines - 1].slice(0, Math.max(0, maxLineLength - 1)).trim()}...`;
  }

  return lines.slice(0, maxLines);
};

const paletteForCategory = (categorySlug) => CATEGORY_PALETTES[categorySlug] || CATEGORY_PALETTES.default;

const toDiskPath = (storageKey) => path.join(productMediaDiskRoot, ...storageKey.split("/"));

const renderTextLines = (lines, startY) =>
  lines
    .map(
      (line, index) =>
        `<text x="112" y="${startY + index * 88}" fill="#f8f9ff" font-size="72" font-weight="700">${escapeXml(line)}</text>`,
    )
    .join("\n");

const renderSeedSvg = ({ productName, categoryName, slug, palette, accentLabel, panelLabel, variant }) => {
  const titleLines = splitTitleLines(productName);
  const sceneOffset = variant === "primary" ? 0 : variant === "detail" ? 70 : 140;
  const accentOpacity = variant === "primary" ? "0.92" : variant === "detail" ? "0.76" : "0.68";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(productName)}</title>
  <desc id="desc">${escapeXml(panelLabel)} for ${escapeXml(productName)} in the ${escapeXml(categoryName)} catalog.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.base}"/>
      <stop offset="100%" stop-color="#0c1121"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.surface}"/>
      <stop offset="100%" stop-color="#11172e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.accent}" stop-opacity="${accentOpacity}"/>
      <stop offset="100%" stop-color="${palette.highlight}" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="1200" fill="url(#bg)"/>
  <circle cx="1270" cy="170" r="240" fill="${palette.accent}" fill-opacity="0.14"/>
  <circle cx="1420" cy="1000" r="280" fill="${palette.highlight}" fill-opacity="0.10"/>
  <circle cx="220" cy="1000" r="300" fill="#ffffff" fill-opacity="0.05"/>

  <rect x="86" y="82" width="1428" height="1036" rx="40" fill="#0d1224" fill-opacity="0.24" stroke="#ffffff" stroke-opacity="0.08"/>
  <text x="112" y="146" fill="${palette.accent}" font-size="28" font-weight="700" letter-spacing="4">${escapeXml(categoryName.toUpperCase())}</text>
  <text x="112" y="202" fill="#f3f5ff" font-size="30" opacity="0.82">${escapeXml(panelLabel)}</text>

  ${renderTextLines(titleLines, 312)}

  <text x="112" y="642" fill="#dbe2ff" font-size="28" opacity="0.72">${escapeXml(accentLabel)}</text>
  <rect x="112" y="686" width="316" height="16" rx="8" fill="${palette.accent}" fill-opacity="0.88"/>
  <rect x="112" y="728" width="242" height="16" rx="8" fill="#ffffff" fill-opacity="0.20"/>
  <rect x="112" y="770" width="196" height="16" rx="8" fill="#ffffff" fill-opacity="0.14"/>

  <g transform="translate(${915 + sceneOffset * 0.12} ${160 + sceneOffset * 0.2})">
    <rect x="0" y="0" width="470" height="760" rx="44" fill="url(#panel)" stroke="#ffffff" stroke-opacity="0.10"/>
    <rect x="58" y="56" width="354" height="648" rx="34" fill="url(#accent)"/>
    <rect x="90" y="118" width="290" height="68" rx="24" fill="#0a1022" fill-opacity="0.24"/>
    <rect x="90" y="224" width="240" height="18" rx="9" fill="#ffffff" fill-opacity="0.92"/>
    <rect x="90" y="266" width="210" height="18" rx="9" fill="#ffffff" fill-opacity="0.66"/>
    <rect x="90" y="540" width="288" height="18" rx="9" fill="#ffffff" fill-opacity="0.88"/>
    <rect x="90" y="582" width="232" height="18" rx="9" fill="#ffffff" fill-opacity="0.62"/>
    <circle cx="354" cy="122" r="30" fill="#0d1429" fill-opacity="0.30"/>
  </g>

  <text x="112" y="1032" fill="#aab6e8" font-size="24" opacity="0.72">${escapeXml(slug || "katabazaar-product")}</text>
</svg>`;
};

const buildSeedDefinitions = ({ product, category }) => {
  const palette = paletteForCategory(category?.slug);
  const baseName = product.slug || product.id;
  const categoryName = category?.name || "Marketplace";
  const lead = product.isDigital ? "Instant digital delivery" : "Marketplace ready stock";

  return [
    {
      storageKey: `${product.id}/seed-primary.svg`,
      originalName: `seed:${baseName}:primary.svg`,
      altText: `${product.name} primary catalog artwork`,
      caption: product.isDigital ? "Primary digital cover" : "Primary catalog view",
      contents: renderSeedSvg({
        productName: product.name,
        categoryName,
        slug: product.slug,
        palette,
        accentLabel: lead,
        panelLabel: "Primary catalog art",
        variant: "primary",
      }),
    },
    {
      storageKey: `${product.id}/seed-detail.svg`,
      originalName: `seed:${baseName}:detail.svg`,
      altText: `${product.name} detail artwork`,
      caption: product.isDigital ? "Digital product detail preview" : "Detail panel preview",
      contents: renderSeedSvg({
        productName: product.name,
        categoryName,
        slug: product.slug,
        palette,
        accentLabel: product.shortDescription || lead,
        panelLabel: "Detail gallery view",
        variant: "detail",
      }),
    },
    {
      storageKey: `${product.id}/seed-context.svg`,
      originalName: `seed:${baseName}:context.svg`,
      altText: `${product.name} contextual artwork`,
      caption: product.isDigital ? "Library and planning context" : "Shelf and context preview",
      contents: renderSeedSvg({
        productName: product.name,
        categoryName,
        slug: product.slug,
        palette,
        accentLabel: "Katabazaar marketplace collection",
        panelLabel: "Context gallery view",
        variant: "context",
      }),
    },
  ];
};

export const seedProductImages = async ({ prisma, product, category }) => {
  const existingImages = await prisma.productImage.findMany({
    where: { productId: product.id },
    select: { id: true },
  });

  if (existingImages.length > 0) {
    return { created: 0, skipped: true };
  }

  const definitions = buildSeedDefinitions({ product, category });

  for (const definition of definitions) {
    const diskPath = toDiskPath(definition.storageKey);
    await fs.mkdir(path.dirname(diskPath), { recursive: true });
    await fs.writeFile(diskPath, definition.contents, "utf8");
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const [index, definition] of definitions.entries()) {
        await tx.productImage.create({
          data: {
            productId: product.id,
            storageKey: definition.storageKey,
            originalName: definition.originalName,
            mimeType: "image/svg+xml",
            sizeBytes: Buffer.byteLength(definition.contents),
            altText: definition.altText,
            caption: definition.caption,
            isPrimary: index === 0,
            sortOrder: index,
          },
        });
      }
    });
  } catch (error) {
    await Promise.all(definitions.map((definition) => fs.unlink(toDiskPath(definition.storageKey)).catch(() => undefined)));
    throw error;
  }

  return { created: definitions.length, skipped: false };
};

