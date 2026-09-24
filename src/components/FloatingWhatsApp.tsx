import React, { useState } from 'react';
import { CONTACT_INFO } from '../data/initialData';
import { MessageCircle, X, Sparkles, Phone, ArrowLeft } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMsg = encodeURIComponent(
    'مرحباً الفولي لخدمات الدش، أود الاستفسار عن خدمات الصيانة ومستلزمات الستالايت لديكم.'
  );

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3 select-none">
      
      {/* Expandable Chat Mini-Card */}
      {isOpen && (
        <div className="bg-white rounded-3xl p-5 shadow-2xl border border-gray-200 w-72 sm:w-80 animate-fade-in relative mb-1">
          {/* Close mini card */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <MessageCircle className="w-6 h-6" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h4 className="font-black text-sm text-[#25213B]">الفولي لخدمات الدش</h4>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <span>متصل الآن للرد السريع</span>
              </span>
            </div>
          </div>

          <div className="bg-[#F5F3FA] rounded-2xl p-3 text-xs text-gray-700 mb-4 leading-relaxed border border-gray-100">
            أهلاً بك! 👋 يسعدنا الإجابة عن استفساراتك حول أسعار ومقاسات أطباق الدش، الرسيفرات، أو حجز موعد زيارة فني لمنزلك.
          </div>

          <div className="space-y-2">
            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${defaultMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>بدء محادثة واتساب فورية</span>
            </a>

            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="w-full py-2.5 px-3 rounded-xl bg-[#283793] hover:bg-[#1b266b] text-white font-semibold text-xs text-center flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-3.5 h-3.5 text-[#F49013]" />
              <span>رقم التواصل: <span dir="ltr" className="font-mono font-bold tracking-wider">01004803335</span></span>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="relative group">
        {/* Ripple effect rings */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-60 animate-ping pointer-events-none" />
        <span className="absolute -inset-2 rounded-full bg-emerald-400/30 blur-xs pointer-events-none" />

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="تواصل عبر واتساب"
          className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <MessageCircle className="w-8 h-8 fill-current" />
          )}

          {/* Online green indicator dot */}
          <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-300 border-2 border-white rounded-full shadow" />
        </button>

        {/* Hover Label for desktop */}
        {!isOpen && (
          <div className="hidden lg:block absolute left-20 top-1/2 -translate-y-1/2 bg-[#25213B]/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10">
            <span>رقم التواصل / واتساب: <span dir="ltr" className="font-mono">01004803335</span></span>
          </div>
        )}
      </div>

    </div>
  );
};
