import React from 'react';
import { SatelliteHeroCanvas } from './3d/SatelliteHeroCanvas';
import { CONTACT_INFO } from '../data/initialData';
import { MessageCircle, Phone, ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-[#25213B] via-[#1e1a32] to-[#25213B] text-white py-10 sm:py-16 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#283793]/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-5 -left-20 w-80 h-80 bg-[#F49013]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-right space-y-5">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#F49013] text-xs font-bold border border-[#F49013]/30">
              المركز المعتمد لمستلزمات الستالايت والدش
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              الفولي لخدمات <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F49013] to-[#ffaa3b]">
                الدش والستالايت
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#E8E4F1]/85 leading-relaxed max-w-xl mx-auto lg:mx-0">
              المتجر الرسمي لبيع وتوريد كافة مستلزمات الدش، الرسيفرات، الكابلات، الشاشات، وقطع الغيار الأصلية بأعلى جودة وضمان.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#categories-section"
                className="px-6 py-3 rounded-2xl bg-[#F49013] hover:bg-[#e07f08] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#F49013]/25 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>تصفح الأقسام</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب واستفسار واتساب</span>
              </a>

              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-[#F49013]" />
                <span className="flex items-center gap-1.5">
                  <span>رقم التواصل:</span>
                  <span dir="ltr" className="font-mono font-bold tracking-wider">01004803335</span>
                </span>
              </a>
            </div>
          </div>

          {/* 3D Satellite Interactive Scene */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-2 backdrop-blur-sm shadow-xl">
              <SatelliteHeroCanvas />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
