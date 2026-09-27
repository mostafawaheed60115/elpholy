import { useState } from 'react';
import { useCatalog } from './hooks/useCatalog';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryList } from './components/CategoryList';
import { CategoryView } from './components/CategoryView';
import { ProductModal } from './components/ProductModal';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import type { Product } from './types/store';

export function App() {
  const { catalog, features, fetchError, isLoading, refreshCatalog } = useCatalog();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const selectedCategory = selectedCategoryId
    ? catalog.categories.find((c) => c.id === selectedCategoryId)
    : null;

  const visibleQuickViewProduct = quickViewProduct
    ? catalog.products.find((product) => product.id === quickViewProduct.id) ?? null
    : null;

  const activeCategoryForModal = visibleQuickViewProduct
    ? catalog.categories.find((category) => category.id === visibleQuickViewProduct.categoryId)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3FA] text-[#25213B] selection:bg-[#F49013] selection:text-white">
      {/* Minimal Navbar */}
      <Navbar
        selectedCategoryName={selectedCategory?.name || null}
        onBackToHome={() => setSelectedCategoryId(null)}
      />

      {fetchError ? (
        <div
          role="alert"
          className="mx-auto mt-4 flex w-[min(92%,80rem)] flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-sm"
        >
          <p>{fetchError}</p>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => void refreshCatalog()}
            className="rounded-lg bg-amber-900 px-3 py-2 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-wait disabled:opacity-60"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : isLoading ? (
        <p role="status" className="mx-auto mt-4 w-[min(92%,80rem)] text-sm text-slate-600" aria-live="polite">
          جارٍ تحميل أحدث بيانات المتجر…
        </p>
      ) : null}

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedCategory ? (
          /* Specific Category Page */
          <CategoryView
            category={selectedCategory}
            products={catalog.products}
            features={features}
            onBack={() => setSelectedCategoryId(null)}
            onSelectProduct={(product) => setQuickViewProduct(product)}
          />
        ) : (
          /* Home Page: Hero + Categories */
          <>
            <Hero />
            <CategoryList
              categories={catalog.categories}
              products={catalog.products}
              onSelectCategory={(id) => {
                setSelectedCategoryId(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      {/* Minimal Footer */}
      <Footer
        categories={catalog.categories}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Product Details Popup (Modal) */}
      <ProductModal
        product={visibleQuickViewProduct}
        category={activeCategoryForModal}
        features={features}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default App;
