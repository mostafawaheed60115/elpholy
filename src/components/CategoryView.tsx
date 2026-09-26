import React, { useState, useMemo } from 'react';
import type { Category, Product, StoreFeatures } from '../types/store';
import { ProductCard } from './ProductCard';
import { CONTACT_INFO } from '../data/initialData';
import { ArrowRight, Search, MessageCircle, PackageOpen } from 'lucide-react';

interface CategoryViewProps {
  category: Category;
  products: Product[];
  features: StoreFeatures;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  products,
  features,
  onBack,
  onSelectProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Products belonging to this category
  const categoryProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.categoryId !== category.id) return false;
      if (!p.isActive) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, category.id, searchQuery]);

  const waInquiry = encodeURIComponent(
    `مرحباً الفولي لخدمات الدش،\nأود الاستفسار عن توفر منتجات وقطع غيار من قسم: "${category.name}".`
  );

  return (
    <div className="py-6 sm:py-12 bg-[#F5F3FA] min-h-[70vh]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* Back to Categories Navigation */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl sm:rounded-2xl bg-white hover:bg-gray-100 border border-gray-200 text-xs sm:text-sm font-bold text-[#283793] transition shadow-xs cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-[#F49013]" />
            <span>العودة لجميع الأقسام</span>
          </button>
        </div>

        {/* Category Header Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/80 shadow-xs mb-6 sm:mb-8 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 p-2 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 text-center md:text-right">
            <span className="text-[11px] sm:text-xs text-[#283793] font-bold bg-[#E8E4F1] px-2.5 py-0.5 rounded-md inline-block mb-1 sm:mb-1.5">
              قسم معتمد
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-[#25213B] mb-1 sm:mb-1.5">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl">
              {category.description || 'تصفح كافة القطع والمنتجات المتاحة في هذا القسم واضغط على أي منتج لعرض التفاصيل والطلب المباشر.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
            <span className="text-[11px] sm:text-xs bg-gray-100 px-3 py-1 rounded-xl text-gray-600 font-bold">
              {categoryProducts.length} {categoryProducts.length === 1 ? 'منتج متاح' : 'منتجات متاحة'}
            </span>
            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${waInquiry}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>طلب قطعة خاصة من هذا القسم</span>
            </a>
          </div>
        </div>

        {/* Filter / Search within category (If category has multiple products) */}
        {categoryProducts.length > 2 && (
          <div className="mb-4 sm:mb-6 relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`ابحث داخل ${category.name}...`}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl sm:rounded-2xl bg-white border border-gray-200 text-xs sm:text-sm focus:border-[#283793] outline-none shadow-xs"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={category}
                features={features}
                onQuickView={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          /* Clean Minimalist Empty State */
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-gray-200 max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#E8E4F1] text-[#283793] flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-[#25213B] mb-2">
              جاري تجهيز منتجات هذا القسم في المتجر
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
              تتوفر كافة قطع ومستلزمات <span className="font-bold text-[#283793]">"{category.name}"</span> في المخزن. يمكنك مراسلتنا فوراً عبر واتساب لتحديد القطعة وسنوفرها لك فوراً.
            </p>
            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${waInquiry}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب استفسار عبر واتساب</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
};
