import React from 'react';
import type { Category, Product } from '../types/store';
import { TiltCard } from './3d/TiltCard';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (id: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  products,
  onSelectCategory,
}) => {
  const productCounts = new Map<string, number>();
  products.forEach(({ categoryId, isActive }) => {
    if (!isActive) return;
    productCounts.set(categoryId, (productCounts.get(categoryId) ?? 0) + 1);
  });

  return (
    <section id="categories-section" className="bg-gradient-to-b from-[#F5F3FA] to-white py-12 text-[#25213B] sm:py-16">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto mb-8 max-w-xl text-center sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#283793]/10 text-[#283793] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F49013]" />
            <span>الأقسام المعتمدة</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-[#25213B] mb-1.5 sm:mb-2">
            أقسام المتجر والمستلزمات
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            اختر القسم لعرض المنتجات وقطع الغيار المتاحة
          </p>
        </div>

        {/* 11 Categories Clean Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat) => {
            const count = productCounts.get(cat.id) ?? 0;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                aria-label={`${cat.name}، ${count} منتجات، عرض القسم`}
                className="w-full rounded-3xl text-right focus-visible:outline-offset-4"
              >
                <TiltCard maxTilt={8} glare={true} className="h-full">
                  <div className="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-3 text-right shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#283793]/40 hover:shadow-xl sm:rounded-3xl sm:p-4">
                    
                    {/* Category Image */}
                    <div className="relative mb-2.5 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:mb-3 sm:rounded-2xl">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />

                      {count > 0 && (
                        <span className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 text-[9px] sm:text-[10px] bg-[#283793] text-white px-1.5 sm:px-2 py-0.5 rounded-full font-bold shadow-xs">
                          {count} {count === 1 ? 'منتج' : 'منتجات'}
                        </span>
                      )}
                    </div>

                    {/* Category Name & Action */}
                    <div className="flex-1 flex flex-col justify-between pt-0.5">
                      <h3 className="mb-1.5 line-clamp-2 min-h-[2.25rem] text-sm font-extrabold leading-snug text-[#25213B] transition-colors group-hover:text-[#283793] sm:mb-2 sm:min-h-[2.5rem] sm:text-base">
                        {cat.name}
                      </h3>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[11px] font-bold text-gray-500 transition-colors group-hover:text-[#F49013] sm:text-xs">
                        <span>عرض المنتجات</span>
                        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </div>

                  </div>
                </TiltCard>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
