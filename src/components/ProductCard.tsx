import React from 'react';
import type { Product, StoreFeatures, Category } from '../types/store';
import { CONTACT_INFO } from '../data/initialData';
import { TiltCard } from './3d/TiltCard';
import { MessageCircle, Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  category?: Category;
  features: StoreFeatures;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  category,
  features,
  onQuickView,
}) => {
  const sortedImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryImage = sortedImages[0]?.url || '/logo.jpeg';
  const hasPrice = Number.isFinite(product.price) && product.price > 0;

  // Standard retail order message
  const waRetailText = encodeURIComponent(
    `مرحباً الفولي لخدمات الدش،\nأود طلب وشراء المنتج:\n- اسم المنتج: ${product.name}\n${features.price && product.price ? `- السعر: ${product.price} ج.م\n` : ''}- كود المنتج: ${product.id}`
  );

  // Wholesale order message requested by user
  const waWholesaleText = encodeURIComponent(
    `السلام عليكم ورحمة الله ..ارغب في طلب جملة\nالمنتج: ${product.name}`
  );

  return (
    <TiltCard maxTilt={6} glare={true} className="h-full">
      <div className="h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-200/90 hover:border-[#283793]/40 shadow-xs hover:shadow-xl transition-all duration-300 group">
        
        {/* Product Image - Clickable to open details popup */}
        <div
          onClick={() => onQuickView(product)}
          className="relative w-full aspect-[4/3] bg-gray-50 p-3 sm:p-4 flex items-center justify-center cursor-pointer overflow-hidden"
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-106"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute('src', '/logo.jpeg');
            }}
          />

          {/* Category tag badge */}
          {category && (
            <span className="absolute top-2.5 right-2.5 text-[10px] sm:text-[11px] bg-[#25213B]/80 backdrop-blur-xs text-white font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
              {category.name}
            </span>
          )}

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-full bg-white text-[#25213B] text-xs font-bold shadow-md flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#283793]" />
              <span>عرض التفاصيل</span>
            </span>
          </div>
        </div>

        {/* Info & Actions */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3
              onClick={() => onQuickView(product)}
              className="font-black text-sm sm:text-base text-[#25213B] hover:text-[#283793] transition cursor-pointer line-clamp-1 mb-1.5 leading-snug"
            >
              {product.name}
            </h3>

            {features.description && product.description && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                {product.description}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-2.5">
            {/* Price (Only regular price, no salePrice) */}
            {features.price && (
              <div className="flex items-baseline gap-1.5">
                {hasPrice ? (
                  <>
                    <span className="text-xl sm:text-2xl font-black text-[#283793] font-mono">
                      {product.price}
                    </span>
                    <span className="text-xs font-bold text-gray-600">ج.م</span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base font-bold text-gray-600">السعر عند الطلب</span>
                )}
              </div>
            )}

            {/* Wholesale CTA Link */}
            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${waWholesaleText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#F49013]" />
              <span>لطلبات الجملة تواصل عبر الواتساب</span>
            </a>

            {/* Retail Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`${CONTACT_INFO.whatsappUrl}?text=${waRetailText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition active:scale-95 min-h-[40px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>طلب قطاعي</span>
              </a>

              <button
                onClick={() => onQuickView(product)}
                className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#25213B] font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer min-h-[40px]"
              >
                <span>التفاصيل</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </TiltCard>
  );
};
