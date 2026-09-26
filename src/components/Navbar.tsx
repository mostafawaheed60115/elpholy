import React from 'react';
import { CONTACT_INFO } from '../data/initialData';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';

interface NavbarProps {
  selectedCategoryName: string | null;
  onBackToHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategoryName,
  onBackToHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#25213B]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-20 sm:h-24 md:h-26 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2.5 sm:gap-4 group text-right cursor-pointer min-w-0"
          >
            {/* Enlarged Prominent Logo */}
            <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-xl sm:rounded-2xl overflow-hidden bg-white p-1 shadow-xl border-2 border-white/20 transition-transform duration-300 group-hover:scale-105 shrink-0 flex items-center justify-center">
              <img
                src="/logo.jpeg"
                alt="الفولي لخدمات الدش"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-2xl md:text-3xl font-black text-white group-hover:text-[#F49013] transition block leading-tight truncate">
                الفولي لخدمات الدش
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm text-[#E8E4F1]/80 font-medium block truncate">
                المركز المعتمد للستالايت والدش
              </span>
            </div>
          </button>
        </div>

        {/* Center Breadcrumb (If in a category page) */}
        {selectedCategoryName && (
          <button
            onClick={onBackToHome}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-[#F49013]" />
            <span>العودة لجميع الأقسام</span>
            <span className="text-white/40">/</span>
            <span className="text-[#F49013]">{selectedCategoryName}</span>
          </button>
        )}

        {/* Minimal Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Facebook Link Icon */}
          <a
            href={CONTACT_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="صفحة فيسبوك الرسمية"
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-[#1877F2] text-gray-300 hover:text-white transition"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Phone Call / رقم التواصل */}
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            title="رقم التواصل: 01004803335"
            className="p-2 sm:py-2 sm:px-3 rounded-xl bg-white/5 hover:bg-white/15 text-gray-200 hover:text-[#F49013] transition flex items-center gap-1.5 text-xs font-bold"
          >
            <Phone className="w-4 h-4 text-[#F49013] shrink-0" />
            <span className="hidden md:inline">رقم التواصل:</span>
            <span dir="ltr" className="hidden sm:inline font-mono font-bold tracking-wider">01004803335</span>
          </a>

          {/* WhatsApp Direct Chat */}
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-2.5 sm:px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">واتساب</span>
          </a>
        </div>

      </div>
    </header>
  );
};
