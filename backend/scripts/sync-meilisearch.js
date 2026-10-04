import { Meilisearch } from 'meilisearch';
import { prisma } from '../src/config/prisma.js';
import { env } from '../src/config/env.js';

const syncAllProducts = async () => {
  console.log('--- Meilisearch Sync Initialized ---');

  if (!env.MEILISEARCH_HOST || !env.MEILISEARCH_MASTER_KEY) {
    console.error('ERROR: MEILISEARCH_HOST or MEILISEARCH_MASTER_KEY is missing from .env');
    process.exit(1);
  }

  const client = new Meilisearch({
    host: env.MEILISEARCH_HOST,
    apiKey: env.MEILISEARCH_MASTER_KEY,
  });

  try {
    console.log('Fetching all active products from PostgreSQL...');
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        variants: true,
      },
    });

    console.log(`Found ${products.length} active products to sync.`);

    const documents = products.map((product) => {
      const startingPrice = Array.isArray(product.variants) && product.variants.length > 0
        ? Math.min(...product.variants.map(v => Number(v.price) || Number.POSITIVE_INFINITY))
        : 0;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription || "",
        description: product.description || "",
        categoryId: product.categoryId,
        categoryName: product.category?.name || "",
        isActive: product.isActive,
        price: startingPrice === Number.POSITIVE_INFINITY ? 0 : startingPrice,
        createdAt: new Date(product.createdAt).getTime(),
        updatedAt: new Date(product.updatedAt).getTime(),
      };
    });

    if (documents.length > 0) {
      console.log('Pushing to Meilisearch "products" index...');
      const task = await client.index('products').addDocuments(documents, { primaryKey: 'id' });
      console.log(`Task enqueued. TaskUID: ${task.taskUid}`);
      
      console.log('Waiting for Meilisearch to process...');
      const result = await client.waitForTask(task.taskUid);
      
      if (result.status === 'succeeded') {
        console.log(`✅ Successfully indexed ${documents.length} products!`);
      } else {
        console.error(`❌ Indexing failed:`, result.error);
      }
    } else {
      console.log('No products to sync.');
    }
  } catch (error) {
    console.error('Error during sync:', error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

syncAllProducts();
