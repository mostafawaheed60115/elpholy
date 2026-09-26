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
  const getProductCount = (categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  return (
    <section id="categories-section" className="py-10 sm:py-18 bg-[#F5F3FA] text-[#25213B]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
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
            const count = getProductCount(cat.id);

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="cursor-pointer"
              >
                <TiltCard maxTilt={8} glare={true} className="h-full">
                  <div className="h-full flex flex-col bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-gray-200/80 hover:border-[#283793]/50 shadow-xs hover:shadow-xl transition-all duration-300 group">
                    
                    {/* Category Image */}
                    <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 mb-2.5 sm:mb-3 flex items-center justify-center border border-gray-100">
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
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
                      <h3 className="font-extrabold text-xs sm:text-base text-[#25213B] group-hover:text-[#283793] transition line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1.5 sm:mb-2 leading-snug">
                        {cat.name}
                      </h3>

                      <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-400 group-hover:text-[#F49013] font-bold pt-1.5 sm:pt-2 border-t border-gray-100 transition">
                        <span>عرض المنتجات</span>
                        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                      </div>
                    </div>

                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
