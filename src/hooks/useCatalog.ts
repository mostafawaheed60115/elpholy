import { useCallback, useEffect, useRef, useState } from 'react';
import type { StoreConfiguration, Category, Product, ProductImage, StoreFeatures, StoreInfo } from '../types/store';
import { INITIAL_STORE_CONFIG } from '../data/initialData';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://stores.nova-solution.net').replace(/\/+$/, '');
const STORE_SLUG = INITIAL_STORE_CONFIG.store.slug || 'elpholy';
const REQUEST_HEADERS = { Accept: 'application/json' };
const ACCESS_FAILURE_STATUSES = new Set([401, 402, 403, 404]);

// Keep rate limits across hook remounts so navigation cannot bypass Retry-After.
let retryAfterTimestamp = 0;

type ActiveRequest = {
  controller: AbortController;
  promise: Promise<void>;
};

function retryAfterDate(response: Response): number | null {
  const value = response.headers.get('Retry-After');
  if (!value) return null;

  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Date.now() + Math.max(0, seconds) * 1000;

  const date = Date.parse(value);
  return Number.isNaN(date) ? null : date;
}

function isAccessFailure(response: Response | null): response is Response {
  return response !== null && ACCESS_FAILURE_STATUSES.has(response.status);
}

function parseConfiguration(raw: any): StoreConfiguration | null {
  if (raw.configuration && typeof raw.configuration === 'string') {
    try {
      return JSON.parse(raw.configuration) as StoreConfiguration;
    } catch {
      return null;
    }
  }

  return raw.store && raw.catalog ? raw as StoreConfiguration : null;
}

function buildConfiguration(menuData: any, storeData: any = null): StoreConfiguration {
  const categories: Category[] = Array.isArray(menuData.categories)
    ? menuData.categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description || null,
        imageUrl: category.img_url || category.imageUrl || '',
        parentId: category.parent_id || category.parentId || null,
      }))
    : INITIAL_STORE_CONFIG.catalog.categories;

  const products: Product[] = Array.isArray(menuData.products)
    ? menuData.products.map((product: any) => {
        let images: ProductImage[] = [];
        if (Array.isArray(product.images) && product.images.length > 0) {
          images = product.images.map((image: any, index: number) => ({
            id: image.id || `${product.id}-img-${index}`,
            url: image.url || image.img_url || image.image_url || '',
            title: image.title || image.img_title || null,
            sortOrder: Number(image.sortOrder ?? image.sort_order ?? index),
          })).filter((image: ProductImage) => image.url);
        } else if (product.image_url || product.imageUrl) {
          images = [{
            id: `${product.id}-img-0`,
            url: product.image_url || product.imageUrl,
            title: product.name,
            sortOrder: 0,
          }];
        }

        return {
          id: product.id,
          categoryId: product.category_id || product.categoryId,
          name: product.name,
          description: product.description || null,
          price: typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 0),
          salePrice: product.sale_price !== undefined ? product.sale_price : (product.salePrice ?? null),
          stock: product.stock ?? null,
          isActive: product.is_active !== undefined ? Boolean(product.is_active) : (product.isActive ?? true),
          images,
        };
      })
    : INITIAL_STORE_CONFIG.catalog.products;

  let storeInfo: StoreInfo = { ...INITIAL_STORE_CONFIG.store };
  if (storeData) {
    const defaultFeatures = INITIAL_STORE_CONFIG.store.features;
    const features: StoreFeatures = {
      price: storeData.allow_price !== undefined ? Boolean(storeData.allow_price) : defaultFeatures.price,
      description: storeData.allow_description !== undefined ? Boolean(storeData.allow_description) : defaultFeatures.description,
      salePrice: storeData.allow_sale_price !== undefined ? Boolean(storeData.allow_sale_price) : defaultFeatures.salePrice,
      stock: storeData.allow_stock !== undefined ? Boolean(storeData.allow_stock) : defaultFeatures.stock,
      checkout: storeData.allow_checkout !== undefined ? Boolean(storeData.allow_checkout) : defaultFeatures.checkout,
      coupons: storeData.allow_coupons !== undefined ? Boolean(storeData.allow_coupons) : defaultFeatures.coupons,
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

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    store: storeInfo,
    catalog: { categories, products },
  };
}

export function useCatalog() {
  const [config, setConfig] = useState<StoreConfiguration>(INITIAL_STORE_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const activeRequestRef = useRef<ActiveRequest | null>(null);
  const hasLiveCatalogRef = useRef(false);
  const accessDeniedRef = useRef(false);

  const refreshCatalog = useCallback((): Promise<void> => {
    if (!mountedRef.current) return Promise.resolve();

    const activeRequest = activeRequestRef.current;
    if (activeRequest && !activeRequest.controller.signal.aborted) {
      return activeRequest.promise;
    }

    if (Date.now() < retryAfterTimestamp) {
      const retryAt = new Date(retryAfterTimestamp).toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' });
      const catalogState = accessDeniedRef.current
        ? 'لا تتوفر بيانات الكتالوج حاليًا.'
        : 'نستخدم النسخة المحفوظة حاليًا.';
      setFetchError(`الخدمة طلبت الانتظار قبل إعادة المحاولة. جرّب بعد ${retryAt}؛ ${catalogState}`);
      return Promise.resolve();
    }

    const controller = new AbortController();
    const { signal } = controller;
    setIsLoading(true);
    setFetchError(null);

    let request: Promise<void>;
    request = (async () => {
      let failureMessage = 'تعذر تحميل أحدث بيانات المتجر؛ نعرض نسخة محفوظة مؤقتًا.';

      const rememberRetryAfter = (response: Response | null) => {
        if (!response) return;
        const retryAt = retryAfterDate(response)
          ?? ([429, 503].includes(response.status) ? Date.now() + 60_000 : null);
        if (retryAt !== null) retryAfterTimestamp = Math.max(retryAfterTimestamp, retryAt);
      };

      const applyConfiguration = (nextConfig: StoreConfiguration, warning: string | null = null, isLive = false) => {
        if (signal.aborted) return;
        setConfig(nextConfig);
        if (isLive) {
          hasLiveCatalogRef.current = true;
          accessDeniedRef.current = false;
          setLastUpdated(new Date());
        }
        setFetchError(warning);
      };

      const denyCatalog = (response: Response) => {
        if (signal.aborted) return;
        accessDeniedRef.current = true;
        hasLiveCatalogRef.current = false;
        setConfig((current) => ({ ...current, catalog: { categories: [], products: [] } }));
        setFetchError(`لا تتوفر بيانات الكتالوج (HTTP ${response.status}). تحقق من رابط المتجر أو صلاحيات الوصول.`);
      };

      const fallbackToSavedCatalog = async () => {
        if (accessDeniedRef.current) {
          setFetchError('لا تتوفر بيانات الكتالوج بعد رفض الوصول. تحقق من رابط المتجر أو صلاحيات الوصول.');
          return;
        }

        // Retain a previously loaded live catalog. On first load, use the bundled brief.
        if (hasLiveCatalogRef.current) {
          setFetchError(failureMessage);
          return;
        }

        try {
          const fallbackResponse = await fetch('/elpholy-ai-storefront-brief.json', {
            headers: REQUEST_HEADERS,
            signal,
          });
          if (fallbackResponse.ok) {
            const fallbackConfig = parseConfiguration(await fallbackResponse.json());
            if (fallbackConfig) {
              applyConfiguration(fallbackConfig, failureMessage);
              return;
            }
          }
        } catch {
          if (signal.aborted) return;
        }

        if (!signal.aborted) setFetchError(failureMessage);
      };

      const applyLiveResponses = async (menuResponse: Response, storeResponse: Response): Promise<boolean> => {
        if (!menuResponse.ok || !storeResponse.ok) return false;
        const [menuData, storeData] = await Promise.all([menuResponse.json(), storeResponse.json()]);
        if (signal.aborted) return false;
        applyConfiguration(buildConfiguration(menuData, storeData), null, true);
        return true;
      };

      try {
        const [menuResult, storeResult] = await Promise.allSettled([
          fetch(`${API_BASE}/public/stores/${STORE_SLUG}/menu`, { headers: REQUEST_HEADERS, signal }),
          fetch(`${API_BASE}/public/stores/${STORE_SLUG}`, { headers: REQUEST_HEADERS, signal }),
        ]);
        if (signal.aborted) return;

        const menuResponse = menuResult.status === 'fulfilled' ? menuResult.value : null;
        const storeResponse = storeResult.status === 'fulfilled' ? storeResult.value : null;
        rememberRetryAfter(menuResponse);
        rememberRetryAfter(storeResponse);

        const accessFailure = [menuResponse, storeResponse].find(isAccessFailure);
        if (accessFailure) {
          denyCatalog(accessFailure);
          return;
        }

        if (menuResponse?.ok && storeResponse?.ok) {
          try {
            if (await applyLiveResponses(menuResponse, storeResponse)) return;
          } catch {
            failureMessage = 'تعذر قراءة أحدث بيانات المتجر؛ نعرض نسخة محفوظة مؤقتًا.';
          }
        } else {
          const failedResponse = [menuResponse, storeResponse].find((response) => response && !response.ok);
          if (failedResponse) {
            failureMessage = `تعذر تحديث بيانات المتجر (HTTP ${failedResponse.status})؛ نعرض نسخة محفوظة مؤقتًا.`;
          } else {
            // Only network/CORS failures are retried through the same-origin proxy.
            failureMessage = 'تعذر الاتصال بخدمة المتجر؛ نعرض نسخة محفوظة مؤقتًا.';
          }
        }

        const hasHttpFailure = [menuResponse, storeResponse].some((response) => response && !response.ok);
        const mayUseProxyFallback = !hasHttpFailure && (!menuResponse || !storeResponse);
        if (signal.aborted) return;

        if (mayUseProxyFallback && Date.now() >= retryAfterTimestamp) {
          try {
            const [proxyMenuResult, proxyStoreResult] = await Promise.allSettled([
              fetch(`/public/stores/${STORE_SLUG}/menu`, { headers: REQUEST_HEADERS, signal }),
              fetch(`/public/stores/${STORE_SLUG}`, { headers: REQUEST_HEADERS, signal }),
            ]);
            if (signal.aborted) return;

            const proxyMenuResponse = proxyMenuResult.status === 'fulfilled' ? proxyMenuResult.value : null;
            const proxyStoreResponse = proxyStoreResult.status === 'fulfilled' ? proxyStoreResult.value : null;
            rememberRetryAfter(proxyMenuResponse);
            rememberRetryAfter(proxyStoreResponse);

            const proxyAccessFailure = [proxyMenuResponse, proxyStoreResponse].find(isAccessFailure);
            if (proxyAccessFailure) {
              denyCatalog(proxyAccessFailure);
              return;
            }

            if (proxyMenuResponse?.ok && proxyStoreResponse?.ok) {
              if (await applyLiveResponses(proxyMenuResponse, proxyStoreResponse)) return;
            } else {
              const failedResponse = [proxyMenuResponse, proxyStoreResponse].find((response) => response && !response.ok);
              failureMessage = failedResponse
                ? `تعذر تحديث بيانات المتجر عبر الوكيل (HTTP ${failedResponse.status})؛ نعرض نسخة محفوظة مؤقتًا.`
                : 'تعذر الاتصال بخدمة المتجر؛ نعرض نسخة محفوظة مؤقتًا.';
            }
          } catch {
            if (signal.aborted) return;
            failureMessage = 'تعذر الاتصال بخدمة المتجر؛ نعرض النسخة المحفوظة حاليًا.';
          }
        }

        if (signal.aborted) return;
        await fallbackToSavedCatalog();
      } catch {
        if (!signal.aborted) await fallbackToSavedCatalog();
      }
    })().finally(() => {
      if (activeRequestRef.current?.promise === request) activeRequestRef.current = null;
      if (!signal.aborted && mountedRef.current) setIsLoading(false);
    });

    activeRequestRef.current = { controller, promise: request };
    return request;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    // Let StrictMode's development-only setup/cleanup replay cancel its first setup.
    const timer = window.setTimeout(() => void refreshCatalog(), 0);

    return () => {
      window.clearTimeout(timer);
      mountedRef.current = false;
      activeRequestRef.current?.controller.abort();
      activeRequestRef.current = null;
    };
  }, [refreshCatalog]);

  return {
    store: config.store,
    catalog: config.catalog,
    features: config.store.features,
    isLoading,
    lastUpdated,
    fetchError,
    refreshCatalog,
  };
}
