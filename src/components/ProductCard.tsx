import React from 'react';
import type { Product, StoreFeatures, Category } from '../types/store';
import { CONTACT_INFO } from '../data/initialData';
import { TiltCard } from './3d/TiltCard';
import { MessageCircle, Tag, Eye } from 'lucide-react';

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

  const hasSale = features.salePrice && product.salePrice !== null && product.salePrice < product.price;
  const currentPrice = hasSale ? product.salePrice : product.price;
  const originalPrice = hasSale ? product.price : null;
  const discountPercent = hasSale && originalPrice && currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const waOrderText = encodeURIComponent(
    `مرحباً الفولي لخدمات الدش،\nأرغب في طلب وشراء المنتج:\n- اسم المنتج: ${product.name}\n${features.price && currentPrice ? `- السعر: ${currentPrice} ج.م\n` : ''}- كود المنتج: ${product.id}`
  );

  return (
    <TiltCard maxTilt={6} glare={true} className="h-full">
      <div className="h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-200/80 hover:border-[#283793]/40 shadow-xs hover:shadow-xl transition-all duration-300 group">
        
        {/* Image - Clickable to open details popup */}
        <div
          onClick={() => onQuickView(product)}
          className="relative w-full aspect-[4/3] bg-gray-50 p-4 flex items-center justify-center cursor-pointer overflow-hidden"
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

          {/* Sale badge */}
          {hasSale && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>خصم {discountPercent}%</span>
            </div>
          )}

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-white text-[#25213B] text-xs font-bold shadow-md flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#283793]" />
              <span>عرض التفاصيل</span>
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3
              onClick={() => onQuickView(product)}
              className="font-black text-base text-[#25213B] hover:text-[#283793] transition cursor-pointer line-clamp-1 mb-1.5"
            >
              {product.name}
            </h3>

            {features.description && product.description && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                {product.description}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-gray-100">
            {/* Price */}
            {features.price && (
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-black text-[#283793] font-mono">
                  {currentPrice}
                </span>
                <span className="text-xs font-bold text-gray-500">ج.م</span>

                {hasSale && originalPrice && (
                  <span className="text-xs line-through text-gray-400 font-mono mr-2">
                    {originalPrice} ج.م
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`${CONTACT_INFO.whatsappUrl}?text=${waOrderText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>طلب واتساب</span>
              </a>

              <button
                onClick={() => onQuickView(product)}
                className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#25213B] font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
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
