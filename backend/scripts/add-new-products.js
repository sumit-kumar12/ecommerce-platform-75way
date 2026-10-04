import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const productMediaDiskRoot = path.join(process.cwd(), "storage", "products");

const newProducts = [
  {
    name: "Ultra HD 4K Action Camera", slug: "ultra-hd-4k-action-camera", shortDescription: "Waterproof 4K action camera with Wi-Fi and accessories.", categorySlug: "tools-electrical", keyword: "camera", price: 5999, stock: 50,
    desc: "Capture every moment in stunning 4K resolution. Waterproof up to 30m, built-in Wi-Fi, and comes with a 15-piece accessory kit."
  },
  {
    name: "Wireless Noise-Cancelling Headphones", slug: "wireless-noise-cancelling-headphones", shortDescription: "Over-ear bluetooth headphones with active noise cancellation.", categorySlug: "tools-electrical", keyword: "headphones", price: 3499, stock: 120,
    desc: "Immerse yourself in music with active noise cancellation. 30 hours of battery life, deep bass, and comfortable ear cushions."
  },
  {
    name: "Smart Fitness Watch", slug: "smart-fitness-watch", shortDescription: "Track your heart rate, sleep, and steps.", categorySlug: "tools-electrical", keyword: "watch", price: 2999, stock: 200,
    desc: "Your personal fitness companion. Tracks heart rate, blood oxygen, sleep patterns, and supports 14 sports modes."
  },
  {
    name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker", shortDescription: "IPX7 waterproof portable speaker with 24h playtime.", categorySlug: "tools-electrical", keyword: "speaker", price: 1999, stock: 85,
    desc: "Take your music anywhere. IPX7 waterproof, rugged design, and delivers powerful bass for up to 24 hours on a single charge."
  },
  {
    name: "Professional Chef Knife Set", slug: "professional-chef-knife-set", shortDescription: "5-piece high-carbon stainless steel knife set with wooden block.", categorySlug: "kitchen-dining", keyword: "knife", price: 4599, stock: 40,
    desc: "Elevate your culinary skills with this 5-piece chef knife set. Made from high-carbon stainless steel for lasting sharpness."
  },
  {
    name: "Cast Iron Dutch Oven", slug: "cast-iron-dutch-oven", shortDescription: "Enameled cast iron dutch oven for slow cooking.", categorySlug: "kitchen-dining", keyword: "pot", price: 5499, stock: 25,
    desc: "Perfect for slow cooking, braising, and baking. Enameled cast iron provides even heat distribution and retention."
  },
  {
    name: "Premium Ceramic Dinner Set", slug: "premium-ceramic-dinner-set", shortDescription: "16-piece handcrafted ceramic dinnerware set.", categorySlug: "kitchen-dining", keyword: "plate", price: 3999, stock: 60,
    desc: "Dine in style with this elegant 16-piece ceramic dinner set. Includes dinner plates, salad plates, bowls, and mugs."
  },
  {
    name: "Luxury Egyptian Cotton Towel Set", slug: "luxury-egyptian-cotton-towel-set", shortDescription: "Ultra-absorbent 6-piece bath towel set.", categorySlug: "home-textiles", keyword: "towel", price: 2499, stock: 150,
    desc: "Experience spa-like luxury at home. Made from 100% Egyptian cotton for superior softness and absorbency."
  },
  {
    name: "Velvet Throw Blanket", slug: "velvet-throw-blanket", shortDescription: "Soft and warm plush velvet throw blanket for couch.", categorySlug: "home-textiles", keyword: "blanket", price: 1299, stock: 100,
    desc: "Cozy up with this ultra-soft velvet throw blanket. Perfect for chilly evenings on the couch or as an extra layer on your bed."
  },
  {
    name: "Aromatherapy Essential Oil Diffuser", slug: "aromatherapy-essential-oil-diffuser", shortDescription: "Ultrasonic humidifier with 7 LED light colors.", categorySlug: "household-needs", keyword: "diffuser", price: 1499, stock: 80,
    desc: "Create a relaxing atmosphere. Ultrasonic technology quietly diffuses essential oils while the 7-color LED light sets the mood."
  },
  {
    name: "Ergonomic Office Chair", slug: "ergonomic-office-chair", shortDescription: "Breathable mesh desk chair with lumbar support.", categorySlug: "household-needs", keyword: "chair", price: 8999, stock: 30,
    desc: "Work in comfort for hours. Features adjustable lumbar support, breathable mesh back, and 3D armrests."
  },
  {
    name: "Organic Green Tea Extract", slug: "organic-green-tea-extract", shortDescription: "Antioxidant-rich organic green tea supplements.", categorySlug: "personal-care", keyword: "tea", price: 899, stock: 300,
    desc: "Boost your metabolism and energy naturally with pure organic green tea extract. Rich in antioxidants and polyphenols."
  },
  {
    name: "Vitamin C Serum with Hyaluronic Acid", slug: "vitamin-c-serum", shortDescription: "Anti-aging facial serum for glowing skin.", categorySlug: "personal-care", keyword: "serum", price: 1199, stock: 250,
    desc: "Revitalize your skin. This powerful formula brightens dark spots, evens skin tone, and deeply hydrates with hyaluronic acid."
  },
  {
    name: "Premium Whey Protein Isolate", slug: "premium-whey-protein", shortDescription: "100% pure whey protein isolate, chocolate flavor.", categorySlug: "personal-care", keyword: "protein", price: 4299, stock: 75,
    desc: "Build muscle faster. 25g of pure whey protein isolate per scoop with zero added sugar and delicious chocolate flavor."
  },
  {
    name: "Artisan Dark Chocolate Truffles", slug: "artisan-dark-chocolate-truffles", shortDescription: "Box of 12 handcrafted Belgian dark chocolate truffles.", categorySlug: "snacks-beverages", keyword: "chocolate", price: 999, stock: 120,
    desc: "Indulge in rich, velvety Belgian dark chocolate. Handcrafted by master chocolatiers with a smooth ganache center."
  },
  {
    name: "Cold Pressed Olive Oil", slug: "cold-pressed-olive-oil", shortDescription: "1L extra virgin cold-pressed olive oil.", categorySlug: "staples-grains", keyword: "oil", price: 1499, stock: 110,
    desc: "100% natural, extra virgin cold-pressed olive oil imported from Italy. Perfect for salads, marinades, and healthy cooking."
  },
  {
    name: "Organic Quinoa Grain", slug: "organic-quinoa-grain", shortDescription: "1kg pack of high-protein organic white quinoa.", categorySlug: "staples-grains", keyword: "quinoa", price: 699, stock: 180,
    desc: "A healthy alternative to rice. Packed with complete protein, fiber, and essential minerals. 100% organic."
  },
  {
    name: "Fresh Atlantic Salmon Fillet", slug: "fresh-atlantic-salmon-fillet", shortDescription: "500g premium fresh salmon fillet.", categorySlug: "ready-to-cook", keyword: "salmon", price: 1299, stock: 40,
    desc: "Premium quality Atlantic salmon fillet. Rich in Omega-3 fatty acids and perfect for grilling, baking, or pan-searing."
  },
  {
    name: "Exotic Dragon Fruit Pack", slug: "exotic-dragon-fruit", shortDescription: "Pack of 3 fresh pink dragon fruits.", categorySlug: "fruits-vegetables", keyword: "fruit", price: 499, stock: 90,
    desc: "Sweet, refreshing, and loaded with antioxidants. Enjoy these vibrant, farm-fresh dragon fruits."
  },
  {
    name: "Smart LED Light Bulbs", slug: "smart-led-light-bulbs", shortDescription: "Pack of 2 Wi-Fi enabled RGB color changing bulbs.", categorySlug: "household-needs", keyword: "bulb", price: 1099, stock: 200,
    desc: "Control your lighting with your voice or smartphone. Choose from 16 million colors and set schedules effortlessly."
  }
];

async function downloadImage(keyword, index, productId, imageType, imageIndex) {
  const url = `https://loremflickr.com/800/800/${keyword}?lock=${index * 3 + imageIndex}`;
  const storageKey = `${productId}/${imageType}-${imageIndex}.jpg`;
  const diskPath = path.join(productMediaDiskRoot, ...storageKey.split("/"));
  
  await fs.mkdir(path.dirname(diskPath), { recursive: true });
  
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(diskPath, Buffer.from(buffer));
  
  return {
    storageKey,
    originalName: `${imageType}-${imageIndex}.jpg`,
    mimeType: "image/jpeg",
    sizeBytes: buffer.byteLength,
    altText: `${keyword} image ${imageIndex}`,
    caption: `Real image of ${keyword}`,
    isPrimary: imageIndex === 0,
    sortOrder: imageIndex,
  };
}

async function run() {
  console.log("Starting to add 20 new products with real images...");
  
  const adminUser = await prisma.user.findFirst();
  if (!adminUser) throw new Error("No user found");
  
  const categories = await prisma.category.findMany();
  const getCategory = (slug) => categories.find(c => c.slug === slug)?.id || categories[0].id;

  for (let i = 0; i < newProducts.length; i++) {
    const prodDef = newProducts[i];
    console.log(`Adding product: ${prodDef.name}`);
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: prodDef.name,
        slug: prodDef.slug,
        shortDescription: prodDef.shortDescription,
        description: prodDef.desc,
        seoTitle: prodDef.name,
        seoDescription: prodDef.shortDescription,
        category: { connect: { id: getCategory(prodDef.categorySlug) } },
        lister: { connect: { id: adminUser.id } },
        isDigital: false,
        paymentOnlineOnly: false,
        paymentAllowCOD: true,
        variants: {
          create: [
            {
              sku: `NEW-${prodDef.slug.toUpperCase()}-V1`,
              title: "Standard Edition",
              attributes: { type: "Standard" },
              price: prodDef.price,
              stock: prodDef.stock
            }
          ]
        }
      }
    });

    // Download 3 images
    const images = [];
    for (let j = 0; j < 3; j++) {
      try {
         const imgDef = await downloadImage(prodDef.keyword, i, product.id, prodDef.slug, j);
         images.push(imgDef);
      } catch (err) {
         console.error("Image download failed", err);
      }
    }

    // Insert images
    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          ...img
        }
      });
    }
  }

  console.log("Adding new offers and flash deals...");
  
  // Add new offers
  await prisma.offer.createMany({
    data: [
      {
        title: "Mega Electronics Clearance",
        description: "Up to 40% off on cameras, headphones, and smartwatches.",
        code: "MEGA-ELEC-40",
        discountPercent: 40,
        categoryId: getCategory("tools-electrical"),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Home & Kitchen Deals",
        description: "Upgrade your living space with flat 25% off.",
        code: "HOME-25",
        discountPercent: 25,
        categoryId: getCategory("kitchen-dining"),
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      }
    ]
  });
  
  console.log("Successfully added 20 products and new offers!");
}

run().catch(console.error).finally(() => prisma.$disconnect());
