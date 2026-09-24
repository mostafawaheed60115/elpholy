import React from 'react';
import { CONTACT_INFO } from '../data/initialData';
import type { Category } from '../types/store';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  categories: Category[];
  onSelectCategory: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ categories, onSelectCategory }) => {
  return (
    <footer className="bg-[#1e1a32] text-white border-t border-white/10 pt-12 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-white p-1 shadow-lg overflow-hidden shrink-0 flex items-center justify-center border border-white/10">
                <img src="/logo.jpeg" alt="الفولي لخدمات الدش" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">الفولي لخدمات الدش</h3>
                <span className="text-xs text-[#F49013] font-bold">المركز المعتمد للستالايت والدش</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
              بيع وتوريد وتركيب أجهزة الستالايت، أطباق الدش، شبكات الدش المركزي، الرسيفرات، الكابلات وحوامل الشاشات بأعلى جودة وضمان.
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={CONTACT_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#1567d3] text-white transition flex items-center gap-2 text-xs font-bold"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>صفحتنا على فيسبوك</span>
              </a>

              {/* WhatsApp button - NO number written on the button as requested */}
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-2 text-xs font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>محادثة واتساب</span>
              </a>
            </div>
          </div>

          {/* Categories Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2">
              الأقسام المعتمدة
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="text-right text-gray-400 hover:text-[#F49013] transition truncate py-0.5 cursor-pointer"
                >
                  • {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2">
              التواصل المباشر
            </h4>

            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F49013] shrink-0" />
                <span>رقم التواصل:</span>
                <a href={`tel:${CONTACT_INFO.phone}`} className="font-bold text-white hover:text-[#F49013] font-mono tracking-wider" dir="ltr">
                  01004803335
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F49013] shrink-0" />
                <span>مواعيد العمل: يومياً 9 ص - 11 م</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F49013] shrink-0" />
                <span>خدمة تغطية وتركيب سريعة</span>
              </div>
            </div>
          </div>

        </div>

        {/* Minimal Bottom Credits */}
        <div className="pt-6 text-center text-xs text-gray-500">
          جميع الحقوق محفوظة © {new Date().getFullYear()} لـ <span className="font-bold text-gray-300">الفولي لخدمات الدش</span> • رقم التواصل: <a href="tel:01004803335" className="text-[#F49013] font-bold font-mono" dir="ltr">01004803335</a>
        </div>

      </div>
    </footer>
  );
};
