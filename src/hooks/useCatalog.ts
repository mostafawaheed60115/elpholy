import { useState, useEffect, useCallback } from 'react';
import type { StoreConfiguration, Category, Product, ProductImage, StoreFeatures, StoreInfo } from '../types/store';
import { INITIAL_STORE_CONFIG } from '../data/initialData';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://stores.nova-solution.net').replace(/\/+$/, '');

export function useCatalog() {
  const [config, setConfig] = useState<StoreConfiguration>(INITIAL_STORE_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Live Catalog Fetcher connecting directly to Cloudflare SaaS backend
  const fetchLiveCatalog = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    const slug = config.store.slug || 'elpholy';

    // 1. Primary Live API: https://stores.nova-solution.net/public/stores/:slug/menu & /public/stores/:slug
    try {
      const [menuRes, storeRes] = await Promise.allSettled([
        fetch(`${API_BASE}/public/stores/${slug}/menu`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        }),
        fetch(`${API_BASE}/public/stores/${slug}`, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        })
      ]);

      if (menuRes.status === 'fulfilled' && menuRes.value.ok) {
        const menuData = await menuRes.value.json();

        // Normalize categories from live API (handles img_url vs imageUrl, parent_id vs parentId)
        const categories: Category[] = Array.isArray(menuData.categories)
          ? menuData.categories.map((cat: any) => ({
              id: cat.id,
              name: cat.name,
              description: cat.description || null,
              imageUrl: cat.img_url || cat.imageUrl || '',
              parentId: cat.parent_id || cat.parentId || null,
            }))
          : config.catalog.categories;

        // Normalize products from live API (handles image_url vs images, category_id vs categoryId, etc.)
        const products: Product[] = Array.isArray(menuData.products)
          ? menuData.products.map((p: any) => {
              let images: ProductImage[] = [];
              if (Array.isArray(p.images) && p.images.length > 0) {
                images = p.images;
              } else if (p.image_url || p.imageUrl) {
                images = [
                  {
                    id: `${p.id}-img-0`,
                    url: p.image_url || p.imageUrl,
                    title: p.name,
                    sortOrder: 0,
                  },
                ];
              }

              return {
                id: p.id,
                categoryId: p.category_id || p.categoryId,
                name: p.name,
                description: p.description || null,
                price: typeof p.price === 'number' ? p.price : (parseFloat(p.price) || 0),
                salePrice: p.sale_price !== undefined ? p.sale_price : (p.salePrice ?? null),
                stock: p.stock ?? null,
                isActive: p.is_active !== undefined ? Boolean(p.is_active) : (p.isActive ?? true),
                images,
              };
            })
          : config.catalog.products;

        // Process store settings & feature flags if storeRes succeeded
        let storeInfo: StoreInfo = { ...config.store };

        if (storeRes.status === 'fulfilled' && storeRes.value.ok) {
          const storeData = await storeRes.value.json();
          const features: StoreFeatures = {
            price: storeData.allow_price !== undefined ? Boolean(storeData.allow_price) : config.store.features.price,
            description: storeData.allow_description !== undefined ? Boolean(storeData.allow_description) : config.store.features.description,
            salePrice: storeData.allow_sale_price !== undefined ? Boolean(storeData.allow_sale_price) : config.store.features.salePrice,
            stock: storeData.allow_stock !== undefined ? Boolean(storeData.allow_stock) : config.store.features.stock,
            checkout: storeData.allow_checkout !== undefined ? Boolean(storeData.allow_checkout) : config.store.features.checkout,
            coupons: storeData.allow_coupons !== undefined ? Boolean(storeData.allow_coupons) : config.store.features.coupons,
          };

          storeInfo = {
            ...storeInfo,
            name: storeData.name || storeInfo.name,
            slug: storeData.slug || storeInfo.slug,
            description: storeData.description || storeInfo.description,
            logoUrl: storeData.logo_url || storeData.logoUrl || storeInfo.logoUrl,
            isActive: storeData.is_active !== undefined ? Boolean(storeData.is_active) : storeInfo.isActive,
            configType: storeData.config_type || storeInfo.configType,
            features,
            checkoutMode: storeData.checkout_mode || storeInfo.checkoutMode,
          };
        }

        setConfig({
          schemaVersion: 1,
          generatedAt: new Date().toISOString(),
          store: storeInfo,
          catalog: {
            categories,
            products,
          },
        });

        setLastUpdated(new Date());
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      console.warn('Direct live API fetch to Cloudflare SaaS backend failed, checking fallbacks:', err);
    }

    // 2. Secondary fallbacks (local proxy, brief json)
    const fallbackEndpoints = [
      `/public/stores/${slug}/menu`,
      `/public/stores/${slug}`,
      `/stores/${slug}`,
      `/elpholy-ai-storefront-brief.json`
    ];

    for (const url of fallbackEndpoints) {
      try {
        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });

        if (res.ok) {
          const raw = await res.json();
          let parsed: StoreConfiguration | null = null;

          if (raw.configuration && typeof raw.configuration === 'string') {
            parsed = JSON.parse(raw.configuration);
          } else if (raw.store && raw.catalog) {
            parsed = raw;
          }

          if (parsed && parsed.store && parsed.catalog) {
            setConfig(parsed);
            setLastUpdated(new Date());
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Continue to next fallback
      }
    }

    setIsLoading(false);
  }, [config.store.slug, config.catalog.categories, config.catalog.products, config.store]);

  useEffect(() => {
    fetchLiveCatalog();
  }, [fetchLiveCatalog]);

  return {
    store: config.store,
    catalog: config.catalog,
    features: config.store.features,
    isLoading,
    lastUpdated,
    fetchError,
    refreshCatalog: fetchLiveCatalog,
  };
}
