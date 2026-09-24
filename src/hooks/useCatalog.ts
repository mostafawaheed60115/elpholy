import { useState, useEffect, useCallback } from 'react';
import type { StoreConfiguration } from '../types/store';
import { INITIAL_STORE_CONFIG } from '../data/initialData';

export function useCatalog() {
  const [config, setConfig] = useState<StoreConfiguration>(INITIAL_STORE_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Live Catalog Fetcher
  const fetchLiveCatalog = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    const endpoints = [
      `/public/stores/${config.store.slug}`,
      `/public/stores/${config.store.slug}/catalog`,
      `/elpholy-ai-storefront-brief.json`
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
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
      } catch (err) {
        // Fallback gracefully
      }
    }

    setIsLoading(false);
  }, [config.store.slug]);

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
