import React, { Suspense } from 'react';
import { CONTACT_INFO } from '../data/initialData';
import { MessageCircle, Phone, ArrowDown } from 'lucide-react';

const SatelliteHeroCanvas = React.lazy(() =>
  import('./3d/SatelliteHeroCanvas').then((module) => ({
    default: module.SatelliteHeroCanvas,
  })),
);

export const Hero: React.FC = () => {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#25213B] via-[#1e1a32] to-[#25213B] py-7 text-white sm:py-10 lg:py-12">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-[#283793]/30 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-5 h-72 w-72 rounded-full bg-[#F49013]/15 blur-[100px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 items-center gap-5 sm:gap-8 lg:grid-cols-12">
          
          {/* Hero Content */}
          <div className="space-y-4 text-center sm:space-y-5 lg:col-span-7 lg:text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#F49013] text-[11px] sm:text-xs font-bold border border-[#F49013]/30">
              المركز المعتمد لمستلزمات الستالايت والدش
            </span>

            <h1 className="text-3xl font-black leading-[1.25] text-white sm:text-4xl lg:text-5xl">
              الفولي لخدمات <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F49013] to-[#ffaa3b]">
                الدش والستالايت
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-7 text-[#E8E4F1]/85 sm:text-base lg:mx-0">
              المتجر الرسمي لبيع وتوريد كافة مستلزمات الدش، الرسيفرات، الكابلات، الشاشات، وقطع الغيار الأصلية بأعلى جودة وضمان.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col items-stretch justify-center gap-2.5 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:pt-2 lg:justify-start">
              <a
                href="#categories-section"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#F49013] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#F49013]/25 transition duration-200 hover:-translate-y-0.5 hover:bg-[#e07f08] active:scale-[.98] sm:w-auto sm:text-sm"
              >
                <span>تصفح الأقسام</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md transition duration-200 hover:bg-emerald-700 active:scale-[.98] sm:w-auto sm:text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>طلب واستفسار واتساب</span>
              </a>

              <a
                href={`tel:${CONTACT_INFO.phone}`}
                aria-label="اتصل على 01004803335"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs font-bold text-white transition duration-200 hover:bg-white/20 active:scale-[.98] sm:w-auto sm:text-sm"
              >
                <Phone className="w-4 h-4 text-[#F49013]" />
                <span dir="ltr" className="font-mono font-bold tracking-wider">01004803335</span>
              </a>
            </div>
          </div>

          {/* 3D Satellite Interactive Scene */}
          <div className="flex items-center justify-center lg:col-span-5">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 shadow-xl shadow-black/10 backdrop-blur-sm sm:rounded-3xl sm:p-2">
              <Suspense fallback={<div className="h-[270px] animate-pulse rounded-xl bg-white/5 sm:h-[360px] lg:h-[420px]" aria-label="جاري تحميل المشهد ثلاثي الأبعاد" />}>
                <SatelliteHeroCanvas />
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
