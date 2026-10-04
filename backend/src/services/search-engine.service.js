import { Meilisearch } from 'meilisearch';
import { env } from '../config/env.js';
import { loggers } from '../config/logger.js';

let client = null;

if (env.MEILISEARCH_HOST && env.MEILISEARCH_MASTER_KEY) {
  client = new Meilisearch({
    host: env.MEILISEARCH_HOST,
    apiKey: env.MEILISEARCH_MASTER_KEY,
  });
} else {
  // Use a fallback or log a warning if Meilisearch is not configured
  loggers.app.warn({
    eventType: "search_engine_unconfigured",
    details: { message: "MEILISEARCH_HOST or MEILISEARCH_MASTER_KEY is not set. Using fallback search." },
  });
}

/**
 * Ensures the 'products' index is created and configured correctly.
 */
export const configureSearchEngine = async () => {
  if (!client) return;
  try {
    const index = client.index('products');

    // Filterable attributes (for where clauses: price >= minPrice, categoryId IN [...])
    await index.updateFilterableAttributes([
      'categoryId',
      'isActive',
      'price'
    ]);

    // Sortable attributes (for order by)
    await index.updateSortableAttributes([
      'price',
      'updatedAt',
      'createdAt',
      'name'
    ]);

    // Searchable attributes (weights: top to bottom)
    await index.updateSearchableAttributes([
      'name',
      'categoryName',
      'shortDescription',
      'description'
    ]);

    // Typo tolerance settings (Google/Amazon style)
    await index.updateTypoTolerance({
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 5,  // e.g. "iphon" -> "iphone"
        twoTypos: 9, // e.g. "playstasion" -> "playstation"
      },
      disableOnWords: [],
      disableOnAttributes: []
    });

    loggers.app.info({
      eventType: "search_engine_configured",
      details: { index: 'products' },
    });
  } catch (error) {
    loggers.app.error({
      eventType: "search_engine_configuration_failed",
      details: { message: error.message },
    });
  }
};

/**
 * Syncs a single product to the search engine.
 */
export const syncProductToSearch = async (product) => {
  if (!client) return;
  
  try {
    const startingPrice = Array.isArray(product.variants) && product.variants.length > 0
      ? Math.min(...product.variants.map(v => Number(v.price) || Number.POSITIVE_INFINITY))
      : 0;

    const document = {
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

    await client.index('products').addDocuments([document], { primaryKey: 'id' });
  } catch (error) {
    loggers.app.error({
      eventType: "search_engine_sync_failed",
      details: { productId: product.id, message: error.message },
    });
  }
};

/**
 * Removes a product from the search engine.
 */
export const removeProductFromSearch = async (productId) => {
  if (!client) return;
  try {
    await client.index('products').deleteDocument(productId);
  } catch (error) {
    loggers.app.error({
      eventType: "search_engine_delete_failed",
      details: { productId, message: error.message },
    });
  }
};

/**
 * Performs a highly optimized, typo-tolerant search.
 */
export const executeSearch = async ({ query, filters, sort, offset, limit }) => {
  if (!client) return null; // Signal fallback to Prisma

  try {
    const filterArray = [];
    if (filters?.categoryId && filters.categoryId.length > 0) {
      const catFilters = filters.categoryId.map(id => `categoryId = "${id}"`);
      filterArray.push([catFilters]); // OR logic within the array
    }
    
    if (filters?.minPrice !== undefined && filters?.minPrice !== null) {
      filterArray.push(`price >= ${filters.minPrice}`);
    }
    if (filters?.maxPrice !== undefined && filters?.maxPrice !== null) {
      filterArray.push(`price <= ${filters.maxPrice}`);
    }

    // Only search active products
    filterArray.push('isActive = true');

    const searchParams = {
      offset,
      limit,
      filter: filterArray,
    };

    if (sort) {
      searchParams.sort = [sort];
    }

    const response = await client.index('products').search(query, searchParams);
    
    return {
      productIds: response.hits.map(hit => hit.id),
      total: response.estimatedTotalHits,
    };
  } catch (error) {
    loggers.app.error({
      eventType: "search_engine_query_failed",
      details: { query, message: error.message },
    });
    return null; // Signal fallback to Prisma
  }
};

export const getSearchClient = () => client;
