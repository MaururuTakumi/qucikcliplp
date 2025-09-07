import React from "react";

export const ThreeStepsSection = (): JSX.Element => {
  return (
    <section id="steps" className="section px-4 py-16 text-center bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="card space-y-8 relative z-10">
        <div className="fade-in-up animate">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            KizunaFinderでスマートなインフルエンサーマーケティングを
          </h2>
        </div>

        <div className="flex justify-center">
          <div className="relative max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl"></div>
            <img 
              src="/assets/kizuna/kzfinder_demo_horz.png" 
              alt="KizunaFinderの使い方デモ" 
              className="w-full relative z-10 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>

        <div className="space-y-4 fade-in-up animate">
          <p className="text-gray-700 text-lg md:text-xl font-medium">
            要件入力 → AIが分析 → 最適インフルエンサーリスト提供 → 完了
          </p>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
};