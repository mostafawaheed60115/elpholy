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
  const { catalog, features } = useCatalog();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const selectedCategory = selectedCategoryId
    ? catalog.categories.find((c) => c.id === selectedCategoryId)
    : null;

  const activeCategoryForModal = quickViewProduct
    ? catalog.categories.find((c) => c.id === quickViewProduct.categoryId)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3FA] text-[#25213B] selection:bg-[#F49013] selection:text-white">
      {/* Minimal Navbar */}
      <Navbar
        selectedCategoryName={selectedCategory?.name || null}
        onBackToHome={() => setSelectedCategoryId(null)}
      />

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
        product={quickViewProduct}
        category={activeCategoryForModal}
        features={features}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default App;
