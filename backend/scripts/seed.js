/**
 * Katabazaar Marketplace - Database Seed Script
 *
 * Creates:
 *   1. Platform and merchant admin users (credentials from environment or safe local defaults)
 *   2. Root categories and subcategories for the Katabazaar marketplace
 *   3. Marketplace sample products with realistic category placement
 *   4. Global payment policy (singleton)
 *
 * Idempotent and migration-friendly. Existing seeded products are updated in place when a known legacy name matches.
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
// import { seedProductImages } from "../src/utils/seed-product-media.js";

const prisma = new PrismaClient();

const PLATFORM_ADMIN_EMAIL = process.env.SEED_PLATFORM_ADMIN_EMAIL || "platform@katabazaar.local";
const PLATFORM_ADMIN_PASSWORD = process.env.SEED_PLATFORM_ADMIN_PASSWORD || "Platform@Katabazaar#2026!Local";
const PLATFORM_ADMIN_NAME = process.env.SEED_PLATFORM_ADMIN_NAME || "Katabazaar Platform Administrator";
const MERCHANT_ADMIN_EMAIL = process.env.SEED_MERCHANT_ADMIN_EMAIL || "merchant@katabazaar.local";
const MERCHANT_ADMIN_PASSWORD = process.env.SEED_MERCHANT_ADMIN_PASSWORD || "Merchant@Katabazaar#2026!Local";
const MERCHANT_ADMIN_NAME = process.env.SEED_MERCHANT_ADMIN_NAME || "Katabazaar Merchant Administrator";
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

const log = (msg) => process.stdout.write(`[seed] ${msg}\n`);

const CATEGORY_DEFS = [
  {
    name: "Grocery",
    slug: "grocery",
    description: "Staples, grains, oils, produce, and pantry essentials.",
    iconName: "local_grocery_store",
    children: [
      { name: "Staples & Grains", slug: "staples-grains", description: "Rice, flour, pulses, and household cooking staples.", iconName: "rice_bowl" },
      { name: "Fruits & Vegetables", slug: "fruits-vegetables", description: "Daily fresh produce for home kitchens.", iconName: "nutrition" },
    ],
  },
  {
    name: "Food",
    slug: "food",
    description: "Snacks, beverages, and quick kitchen-ready food lines.",
    iconName: "restaurant",
    children: [
      { name: "Snacks & Beverages", slug: "snacks-beverages", description: "Packaged snacks, juices, tea, and coffee essentials.", iconName: "fastfood" },
      { name: "Ready to Cook", slug: "ready-to-cook", description: "Quick meal kits and ready-to-cook staples.", iconName: "ramen_dining" },
    ],
  },
  {
    name: "Hardware",
    slug: "hardware",
    description: "Tools, electrical items, fittings, and repair essentials.",
    iconName: "construction",
    children: [
      { name: "Tools & Electrical", slug: "tools-electrical", description: "Toolkits, electrical accessories, and home repair gear.", iconName: "handyman" },
      { name: "Plumbing & Fittings", slug: "plumbing-fittings", description: "Pipes, adapters, and utility fittings for home maintenance.", iconName: "plumbing" },
    ],
  },
  {
    name: "Home Items",
    slug: "home-items",
    description: "Kitchen, dining, textiles, and practical home-use products.",
    iconName: "chair_alt",
    children: [
      { name: "Kitchen & Dining", slug: "kitchen-dining", description: "Cookware, drinkware, and dining essentials.", iconName: "kitchen" },
      { name: "Home Textiles", slug: "home-textiles", description: "Towels, linens, and household comfort items.", iconName: "bedroom_parent" },
    ],
  },
  {
    name: "Daily Essentials",
    slug: "daily-essentials",
    description: "Personal care, hygiene, and household-use daily essentials.",
    iconName: "shopping_basket",
    children: [
      { name: "Personal Care", slug: "personal-care", description: "Health, hygiene, and grooming products.", iconName: "health_and_beauty" },
      { name: "Household Needs", slug: "household-needs", description: "Organizers, planners, and everyday household utilities.", iconName: "inventory" },
    ],
  },
];

const PRODUCT_DEFS = [
  {
    "name": "Premium Market Product 1",
    "slug": "premium-market-product-1",
    "shortDescription": "High quality item 1 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 1, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 1 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 1 at unbeatable prices.",
    "categorySlug": "kitchen-dining",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-1-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 105,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 2",
    "slug": "premium-market-product-2",
    "shortDescription": "High quality item 2 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 2, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 2 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 2 at unbeatable prices.",
    "categorySlug": "home-textiles",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-2-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 110,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 3",
    "slug": "premium-market-product-3",
    "shortDescription": "High quality item 3 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 3, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 3 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 3 at unbeatable prices.",
    "categorySlug": "personal-care",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-3-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 115,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 4",
    "slug": "premium-market-product-4",
    "shortDescription": "High quality item 4 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 4, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 4 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 4 at unbeatable prices.",
    "categorySlug": "household-needs",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-4-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 120,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 5",
    "slug": "premium-market-product-5",
    "shortDescription": "High quality item 5 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 5, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 5 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 5 at unbeatable prices.",
    "categorySlug": "snacks-beverages",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-5-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 125,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 6",
    "slug": "premium-market-product-6",
    "shortDescription": "High quality item 6 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 6, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 6 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 6 at unbeatable prices.",
    "categorySlug": "ready-to-cook",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-6-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 130,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 7",
    "slug": "premium-market-product-7",
    "shortDescription": "High quality item 7 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 7, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 7 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 7 at unbeatable prices.",
    "categorySlug": "staples-grains",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-7-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 135,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 8",
    "slug": "premium-market-product-8",
    "shortDescription": "High quality item 8 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 8, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 8 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 8 at unbeatable prices.",
    "categorySlug": "fruits-vegetables",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-8-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 140,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 9",
    "slug": "premium-market-product-9",
    "shortDescription": "High quality item 9 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 9, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 9 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 9 at unbeatable prices.",
    "categorySlug": "tools-electrical",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-9-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 145,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 10",
    "slug": "premium-market-product-10",
    "shortDescription": "High quality item 10 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 10, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 10 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 10 at unbeatable prices.",
    "categorySlug": "kitchen-dining",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-10-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 150,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 11",
    "slug": "premium-market-product-11",
    "shortDescription": "High quality item 11 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 11, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 11 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 11 at unbeatable prices.",
    "categorySlug": "home-textiles",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-11-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 155,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 12",
    "slug": "premium-market-product-12",
    "shortDescription": "High quality item 12 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 12, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 12 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 12 at unbeatable prices.",
    "categorySlug": "personal-care",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-12-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 160,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 13",
    "slug": "premium-market-product-13",
    "shortDescription": "High quality item 13 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 13, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 13 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 13 at unbeatable prices.",
    "categorySlug": "household-needs",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-13-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 165,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 14",
    "slug": "premium-market-product-14",
    "shortDescription": "High quality item 14 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 14, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 14 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 14 at unbeatable prices.",
    "categorySlug": "snacks-beverages",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-14-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 170,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 15",
    "slug": "premium-market-product-15",
    "shortDescription": "High quality item 15 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 15, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 15 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 15 at unbeatable prices.",
    "categorySlug": "ready-to-cook",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-15-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 175,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 16",
    "slug": "premium-market-product-16",
    "shortDescription": "High quality item 16 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 16, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 16 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 16 at unbeatable prices.",
    "categorySlug": "staples-grains",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-16-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 180,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 17",
    "slug": "premium-market-product-17",
    "shortDescription": "High quality item 17 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 17, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 17 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 17 at unbeatable prices.",
    "categorySlug": "fruits-vegetables",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-17-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 185,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 18",
    "slug": "premium-market-product-18",
    "shortDescription": "High quality item 18 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 18, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 18 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 18 at unbeatable prices.",
    "categorySlug": "tools-electrical",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-18-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 190,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 19",
    "slug": "premium-market-product-19",
    "shortDescription": "High quality item 19 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 19, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 19 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 19 at unbeatable prices.",
    "categorySlug": "kitchen-dining",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-19-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 195,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 20",
    "slug": "premium-market-product-20",
    "shortDescription": "High quality item 20 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 20, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 20 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 20 at unbeatable prices.",
    "categorySlug": "home-textiles",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-20-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 200,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 21",
    "slug": "premium-market-product-21",
    "shortDescription": "High quality item 21 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 21, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 21 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 21 at unbeatable prices.",
    "categorySlug": "personal-care",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-21-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 205,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 22",
    "slug": "premium-market-product-22",
    "shortDescription": "High quality item 22 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 22, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 22 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 22 at unbeatable prices.",
    "categorySlug": "household-needs",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-22-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 210,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 23",
    "slug": "premium-market-product-23",
    "shortDescription": "High quality item 23 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 23, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 23 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 23 at unbeatable prices.",
    "categorySlug": "snacks-beverages",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-23-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 215,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 24",
    "slug": "premium-market-product-24",
    "shortDescription": "High quality item 24 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 24, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 24 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 24 at unbeatable prices.",
    "categorySlug": "ready-to-cook",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-24-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 220,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 25",
    "slug": "premium-market-product-25",
    "shortDescription": "High quality item 25 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 25, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 25 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 25 at unbeatable prices.",
    "categorySlug": "staples-grains",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-25-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 225,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 26",
    "slug": "premium-market-product-26",
    "shortDescription": "High quality item 26 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 26, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 26 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 26 at unbeatable prices.",
    "categorySlug": "fruits-vegetables",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-26-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 230,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 27",
    "slug": "premium-market-product-27",
    "shortDescription": "High quality item 27 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 27, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 27 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 27 at unbeatable prices.",
    "categorySlug": "tools-electrical",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-27-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 235,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 28",
    "slug": "premium-market-product-28",
    "shortDescription": "High quality item 28 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 28, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 28 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 28 at unbeatable prices.",
    "categorySlug": "kitchen-dining",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-28-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 240,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 29",
    "slug": "premium-market-product-29",
    "shortDescription": "High quality item 29 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 29, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 29 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 29 at unbeatable prices.",
    "categorySlug": "home-textiles",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-29-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 245,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 30",
    "slug": "premium-market-product-30",
    "shortDescription": "High quality item 30 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 30, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 30 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 30 at unbeatable prices.",
    "categorySlug": "personal-care",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-30-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 250,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 31",
    "slug": "premium-market-product-31",
    "shortDescription": "High quality item 31 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 31, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 31 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 31 at unbeatable prices.",
    "categorySlug": "household-needs",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-31-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 255,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 32",
    "slug": "premium-market-product-32",
    "shortDescription": "High quality item 32 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 32, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 32 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 32 at unbeatable prices.",
    "categorySlug": "snacks-beverages",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-32-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 260,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 33",
    "slug": "premium-market-product-33",
    "shortDescription": "High quality item 33 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 33, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 33 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 33 at unbeatable prices.",
    "categorySlug": "ready-to-cook",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-33-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 265,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 34",
    "slug": "premium-market-product-34",
    "shortDescription": "High quality item 34 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 34, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 34 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 34 at unbeatable prices.",
    "categorySlug": "staples-grains",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-34-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 270,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 35",
    "slug": "premium-market-product-35",
    "shortDescription": "High quality item 35 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 35, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 35 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 35 at unbeatable prices.",
    "categorySlug": "fruits-vegetables",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-35-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 275,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 36",
    "slug": "premium-market-product-36",
    "shortDescription": "High quality item 36 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 36, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 36 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 36 at unbeatable prices.",
    "categorySlug": "tools-electrical",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-36-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 280,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 37",
    "slug": "premium-market-product-37",
    "shortDescription": "High quality item 37 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 37, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 37 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 37 at unbeatable prices.",
    "categorySlug": "kitchen-dining",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-37-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 285,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 38",
    "slug": "premium-market-product-38",
    "shortDescription": "High quality item 38 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 38, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 38 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 38 at unbeatable prices.",
    "categorySlug": "home-textiles",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-38-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 290,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 39",
    "slug": "premium-market-product-39",
    "shortDescription": "High quality item 39 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 39, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 39 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 39 at unbeatable prices.",
    "categorySlug": "personal-care",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-39-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 295,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 40",
    "slug": "premium-market-product-40",
    "shortDescription": "High quality item 40 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 40, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 40 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 40 at unbeatable prices.",
    "categorySlug": "household-needs",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-40-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 300,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 41",
    "slug": "premium-market-product-41",
    "shortDescription": "High quality item 41 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 41, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 41 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 41 at unbeatable prices.",
    "categorySlug": "snacks-beverages",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-41-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 305,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 42",
    "slug": "premium-market-product-42",
    "shortDescription": "High quality item 42 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 42, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 42 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 42 at unbeatable prices.",
    "categorySlug": "ready-to-cook",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-42-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 310,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 43",
    "slug": "premium-market-product-43",
    "shortDescription": "High quality item 43 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 43, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 43 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 43 at unbeatable prices.",
    "categorySlug": "staples-grains",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-43-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 315,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 44",
    "slug": "premium-market-product-44",
    "shortDescription": "High quality item 44 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 44, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 44 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 44 at unbeatable prices.",
    "categorySlug": "fruits-vegetables",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-44-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 320,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 45",
    "slug": "premium-market-product-45",
    "shortDescription": "High quality item 45 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 45, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 45 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 45 at unbeatable prices.",
    "categorySlug": "tools-electrical",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-45-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 325,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 46",
    "slug": "premium-market-product-46",
    "shortDescription": "High quality item 46 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 46, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 46 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 46 at unbeatable prices.",
    "categorySlug": "kitchen-dining",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-46-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 330,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 47",
    "slug": "premium-market-product-47",
    "shortDescription": "High quality item 47 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 47, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 47 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 47 at unbeatable prices.",
    "categorySlug": "home-textiles",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-47-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 335,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 48",
    "slug": "premium-market-product-48",
    "shortDescription": "High quality item 48 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 48, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 48 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 48 at unbeatable prices.",
    "categorySlug": "personal-care",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-48-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 340,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 49",
    "slug": "premium-market-product-49",
    "shortDescription": "High quality item 49 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 49, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 49 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 49 at unbeatable prices.",
    "categorySlug": "household-needs",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-49-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 345,
        "stock": 50
      }
    ]
  },
  {
    "name": "Premium Market Product 50",
    "slug": "premium-market-product-50",
    "shortDescription": "High quality item 50 for daily use.",
    "legacyNames": [],
    "description": "This is a premium market product 50, designed for the best experience. Buy now and enjoy!",
    "seoTitle": "Premium Market Product 50 | Best Deals",
    "seoDescription": "Get the best Premium Market Product 50 at unbeatable prices.",
    "categorySlug": "snacks-beverages",
    "isDigital": false,
    "paymentOnlineOnly": false,
    "paymentAllowCOD": true,
    "paymentMinCODPrice": null,
    "variants": [
      {
        "sku": "PROD-50-V1",
        "title": "Standard",
        "attributes": {
          "type": "Standard"
        },
        "price": 350,
        "stock": 50
      }
    ]
  }
];


const OFFER_DEFS = [
  {
    "title": "Mega Deal 2026",
    "description": "Get 50% off on premium market products.",
    "code": "MEGA-DEAL-50",
    "discountPercent": 50,
    "categorySlug": "tools-electrical",
    "hoursToLive": 48
  }
];


async function seedAdminUsers() {
  log("Seeding platform and merchant admin users...");
  const platformPasswordHash = await bcrypt.hash(PLATFORM_ADMIN_PASSWORD, BCRYPT_ROUNDS);
  const merchantPasswordHash = await bcrypt.hash(MERCHANT_ADMIN_PASSWORD, BCRYPT_ROUNDS);

  const platformAdmin = await prisma.user.upsert({
    where: { email: PLATFORM_ADMIN_EMAIL },
    update: { role: "SECURITY_ADMIN", isActive: true, name: PLATFORM_ADMIN_NAME },
    create: {
      email: PLATFORM_ADMIN_EMAIL,
      passwordHash: platformPasswordHash,
      name: PLATFORM_ADMIN_NAME,
      role: "SECURITY_ADMIN",
      isActive: true,
    },
  });

  const merchantAdmin = await prisma.user.upsert({
    where: { email: MERCHANT_ADMIN_EMAIL },
    update: { role: "COMMERCE_ADMIN", isActive: true, name: MERCHANT_ADMIN_NAME },
    create: {
      email: MERCHANT_ADMIN_EMAIL,
      passwordHash: merchantPasswordHash,
      name: MERCHANT_ADMIN_NAME,
      role: "COMMERCE_ADMIN",
      isActive: true,
    },
  });

  log(`Platform admin: ${platformAdmin.email} (id=${platformAdmin.id})`);
  log(`Merchant admin: ${merchantAdmin.email} (id=${merchantAdmin.id})`);
  return { platformAdmin, merchantAdmin };
}

async function upsertCategoryNode(def, parentId, sortOrder) {
  return prisma.category.upsert({
    where: { slug: def.slug },
    update: {
      parentId,
      name: def.name,
      description: def.description,
      iconName: def.iconName,
      sortOrder,
      isActive: true,
    },
    create: {
      parentId,
      name: def.name,
      slug: def.slug,
      description: def.description,
      iconName: def.iconName,
      sortOrder,
      isActive: true,
    },
  });
}

async function seedCategories() {
  log("Seeding category tree...");
  const categoriesBySlug = new Map();

  for (const [rootIndex, rootDef] of CATEGORY_DEFS.entries()) {
    const root = await upsertCategoryNode(rootDef, null, rootIndex);
    categoriesBySlug.set(root.slug, root);
    log(`Category: ${root.name} (id=${root.id})`);

    for (const [childIndex, childDef] of rootDef.children.entries()) {
      const child = await upsertCategoryNode(childDef, root.id, childIndex);
      categoriesBySlug.set(child.slug, child);
      log(`  Subcategory: ${child.name} (id=${child.id})`);
    }
  }

  await prisma.category.updateMany({
    where: {
      slug: { in: ["electronics", "apparel-fashion", "home-living"] },
    },
    data: { isActive: false },
  });

  return categoriesBySlug;
}

async function findExistingProduct(adminId, names) {
  return prisma.product.findFirst({
    where: {
      listerId: adminId,
      name: { in: names },
    },
  });
}

async function seedProducts(adminId, categoriesBySlug) {
  log("Seeding marketplace products...");

  for (const def of PRODUCT_DEFS) {
    const category = categoriesBySlug.get(def.categorySlug);
    if (!category) {
      throw new Error(`Category slug not found during product seed: ${def.categorySlug}`);
    }

    const { legacyNames, variants: variantDefs, categorySlug, ...productData } = def;
    const matchNames = [def.name, ...(legacyNames || [])];
    const existing = await findExistingProduct(adminId, matchNames);

    let product;
    if (existing) {
      product = await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...productData,
          categoryId: category.id,
          isActive: true,
        },
      });
      log(`Updated product: ${product.name}`);
    } else {
      product = await prisma.product.create({
        data: {
          ...productData,
          categoryId: category.id,
          listerId: adminId,
          isActive: true,
        },
      });
      log(`Created product: ${product.name} (id=${product.id})`);
    }

    for (const variant of variantDefs) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: {
          productId: product.id,
          title: variant.title,
          attributes: variant.attributes,
          price: variant.price,
          stock: variant.stock,
          isActive: true,
        },
        create: {
          productId: product.id,
          sku: variant.sku,
          title: variant.title,
          attributes: variant.attributes,
          price: variant.price,
          stock: variant.stock,
          isActive: true,
        },
      });
      log(`  Variant: ${variant.sku}`);
    }

    await prisma.productVariant.updateMany({
      where: {
        productId: product.id,
        sku: { notIn: variantDefs.map((variant) => variant.sku) },
      },
      data: { isActive: false },
    });

    const existingImages = await prisma.productImage.findMany({
  where: { productId: product.id },
  select: { id: true },
});
if (existingImages.length === 0) {
  const imgIdx = (product.name.length % 3) + 1;
  const imgName = 'downloaded-' + imgIdx + '.jpg';
  const targetKey = product.id + '/' + imgName;
  
  const fs = await import('node:fs');
  const path = await import('node:path');
  const sourceFile = path.resolve('storage/products/global', imgName);
  const targetFile = path.resolve('storage/products', targetKey);
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  if (fs.existsSync(sourceFile)) fs.copyFileSync(sourceFile, targetFile);

  await prisma.productImage.create({
    data: {
      productId: product.id,
      storageKey: targetKey,
      originalName: imgName,
      mimeType: 'image/jpeg',
      sizeBytes: 50000,
      altText: product.name,
      caption: product.shortDescription,
      isPrimary: true,
      sortOrder: 0,
    },
  });
  log('  Media: Linked downloaded image ' + imgName);
}

  }
}

async function seedOffers(categoriesBySlug) {
  log("Seeding offers...");
  const now = new Date();

  for (const def of OFFER_DEFS) {
    const category = categoriesBySlug.get(def.categorySlug);
    
    // Start date 1 hour ago
    const startDate = new Date(now.getTime() - 60 * 60 * 1000);
    // End date based on hoursToLive
    const endDate = new Date(now.getTime() + def.hoursToLive * 60 * 60 * 1000);

    await prisma.offer.upsert({
      where: { code: def.code },
      update: {
        title: def.title,
        description: def.description,
        discountPercent: def.discountPercent,
        startDate,
        endDate,
        isActive: true,
        categoryId: category ? category.id : null,
      },
      create: {
        title: def.title,
        description: def.description,
        code: def.code,
        discountPercent: def.discountPercent,
        startDate,
        endDate,
        isActive: true,
        categoryId: category ? category.id : null,
      },
    });
    log(`  Offer: ${def.code} (-${def.discountPercent}%)`);
  }
}

async function seedGlobalPaymentPolicy() {
  log("Seeding global payment policy...");
  const policy = await prisma.globalPaymentPolicy.upsert({
    where: { singletonKey: "GLOBAL" },
    update: {},
    create: {
      singletonKey: "GLOBAL",
      onlineOnly: false,
      allowCOD: true,
      minCODPrice: null,
      forceDigitalOnline: true,
    },
  });
  log(`Payment policy: onlineOnly=${policy.onlineOnly}, allowCOD=${policy.allowCOD}, forceDigitalOnline=${policy.forceDigitalOnline}`);
}

async function main() {
  log("=== Katabazaar Marketplace Seed ===");
  log(`Target DB: ${process.env.DATABASE_URL?.replace(/:[^:@]*@/, ":***@") ?? "(unknown)"}`);

  try {
    const { merchantAdmin } = await seedAdminUsers();
    const categoriesBySlug = await seedCategories();
    await seedProducts(merchantAdmin.id, categoriesBySlug);
    await seedOffers(categoriesBySlug);
    await seedGlobalPaymentPolicy();

    log("=== Seed complete ===");
    log(`Platform admin login: ${PLATFORM_ADMIN_EMAIL} / ${PLATFORM_ADMIN_PASSWORD}`);
    log(`Merchant admin login: ${MERCHANT_ADMIN_EMAIL} / ${MERCHANT_ADMIN_PASSWORD}`);
    log("IMPORTANT: Change the admin password immediately after first login in production!");
  } catch (error) {
    process.stderr.write(`[seed] FATAL: ${error.message}\n`);
    process.stderr.write(error.stack + "\n");
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();


