import React, { useState, useEffect } from 'react';
import type { Product, StoreFeatures, Category } from '../types/store';
import { CONTACT_INFO } from '../data/initialData';
import { X, MessageCircle, Phone, Share2, Tag, ShieldCheck } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  category?: Category;
  features: StoreFeatures;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  category,
  features,
  onClose,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedImgIndex(0);
    setQuantity(1);
    setCopied(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const sortedImages = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentImage = sortedImages[selectedImgIndex]?.url || '/logo.jpeg';

  const hasSale = features.salePrice && product.salePrice !== null && product.salePrice < product.price;
  const unitPrice = hasSale ? product.salePrice : product.price;
  const originalPrice = hasSale ? product.price : null;
  const totalPrice = unitPrice ? unitPrice * quantity : 0;

  const waOrderText = encodeURIComponent(
    `مرحباً الفولي لخدمات الدش،\nأود طلب المنتج التالي:\n- اسم المنتج: ${product.name}\n- الكمية: ${quantity}\n${features.price && totalPrice ? `- إجمالي السعر: ${totalPrice} ج.م\n` : ''}- كود المنتج: ${product.id}\nيرجى التواصل لتأكيد الطلب والتوصيل.`
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md transition cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Image side */}
        <div className="md:w-1/2 bg-[#F5F3FA] p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-l border-gray-200">
          <div className="relative w-full aspect-square max-h-[300px] rounded-2xl bg-white p-4 flex items-center justify-center shadow-xs overflow-hidden mb-3">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).setAttribute('src', '/logo.jpeg');
              }}
            />
            {hasSale && (
              <span className="absolute top-3 right-3 bg-red-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                خصم خاص
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {sortedImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto w-full justify-center py-1">
              {sortedImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden bg-white p-1 border-2 transition cursor-pointer ${
                    selectedImgIndex === idx
                      ? 'border-[#283793] scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          <div className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 mt-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>منتج أصلي معتمد مع ضمان الفولي</span>
          </div>
        </div>

        {/* Details side */}
        <div className="md:w-1/2 p-6 sm:p-7 flex flex-col justify-between overflow-y-auto">
          <div>
            {category && (
              <span className="inline-block text-xs font-bold text-[#283793] bg-[#E8E4F1] px-2.5 py-0.5 rounded-lg mb-2">
                {category.name}
              </span>
            )}

            <h2 className="text-xl sm:text-2xl font-black text-[#25213B] mb-2 leading-snug">
              {product.name}
            </h2>

            {/* Price */}
            {features.price && (
              <div className="flex items-baseline gap-2 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <span className="text-2xl font-black text-[#283793] font-mono">
                  {unitPrice}
                </span>
                <span className="text-xs font-bold text-gray-500">ج.م</span>

                {hasSale && originalPrice && (
                  <span className="text-xs line-through text-gray-400 font-mono mr-2">
                    {originalPrice} ج.م
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {features.description && product.description && (
              <div className="mb-5">
                <h4 className="text-xs font-bold text-gray-400 mb-1">المواصفات:</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center justify-between py-2.5 border-y border-gray-100 mb-5">
              <span className="text-xs font-bold text-gray-700">الكمية المطلوبة:</span>
              <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white font-bold text-gray-700 shadow-xs hover:bg-gray-50 transition cursor-pointer"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold font-mono text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white font-bold text-gray-700 shadow-xs hover:bg-gray-50 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-1">
            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${waOrderText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب مباشر عبر واتساب ({totalPrice} ج.م)</span>
            </a>

            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#25213B] font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#F49013]" />
              <span>اتصال برقم التواصل: <span dir="ltr" className="font-mono font-bold tracking-wider">01004803335</span></span>
            </a>

            <button
              onClick={handleShare}
              className="w-full text-center text-xs text-gray-400 hover:text-[#283793] font-medium pt-1 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'تم نسخ الرابط!' : 'مشاركة المنتج'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
