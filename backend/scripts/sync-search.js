import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { configureSearchEngine, syncProductToSearch, getSearchClient } from '../src/services/search-engine.service.js';

const prisma = new PrismaClient();

async function syncAll() {
  console.log("Configuring search engine...");
  await configureSearchEngine();
  
  const client = getSearchClient();
  if (!client) {
    console.error("Search engine client not initialized.");
    process.exit(1);
  }

  console.log("Clearing existing documents...");
  await client.index('products').deleteAllDocuments();

  console.log("Fetching all active products...");
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      variants: { where: { isActive: true } }
    }
  });

  console.log(`Found ${products.length} products. Syncing...`);
  for (const product of products) {
    await syncProductToSearch(product);
  }
  
  console.log("Sync complete.");
  await prisma.$disconnect();
}

syncAll().catch(err => {
  console.error(err);
  process.exit(1);
});
