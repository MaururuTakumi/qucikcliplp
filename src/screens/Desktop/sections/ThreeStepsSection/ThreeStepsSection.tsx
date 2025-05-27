import React from "react";

export const ThreeStepsSection = (): JSX.Element => {
  return (
    <section id="steps" className="section px-4 py-32 md:py-40 text-center space-y-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="card space-y-16 relative z-10">
        <div className="fade-in-up animate">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            導入フローは <span className="text-primary-600 font-bold">3 ステップ</span> だけ
          </h2>
        </div>

        {/* 画像横並び */}
        <div className="flex items-start justify-between max-w-7xl mx-auto overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory px-6">
          <div className="flex-shrink-0 snap-center flex flex-col items-center min-w-[220px] group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <img src="/assets/steps/scan.png" alt="QR をスキャンする iPhone" className="h-72 md:h-80 lg:h-[300px] xl:h-[320px] w-[260px] object-contain object-top relative z-10 scale-on-hover" />
            </div>
          </div>
          <div className="flex-shrink-0 snap-center flex items-center justify-center min-w-[100px]">
            <span className="text-5xl lg:text-6xl text-primary-600 animate-pulse">→</span>
          </div>
          <div className="flex-shrink-0 snap-center flex flex-col items-center min-w-[220px] group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <img src="/assets/steps/appclip.png" alt="App Clip カード" className="h-72 md:h-80 lg:h-[300px] xl:h-[320px] w-[260px] object-contain object-top relative z-10 scale-on-hover" />
            </div>
          </div>
          <div className="flex-shrink-0 snap-center flex items-center justify-center min-w-[100px]">
            <span className="text-5xl lg:text-6xl text-primary-600 animate-pulse">→</span>
          </div>
          <div className="flex-shrink-0 snap-center flex flex-col items-center min-w-[220px] group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <img src="/assets/steps/pay.png" alt="Apple Pay シート" className="h-72 md:h-80 lg:h-[300px] xl:h-[320px] w-[260px] object-contain object-top relative z-10 scale-on-hover" />
            </div>
          </div>
          <div className="flex-shrink-0 snap-center flex items-center justify-center min-w-[100px]">
            <span className="text-5xl lg:text-6xl text-primary-600 animate-pulse">→</span>
          </div>
          <div className="flex-shrink-0 snap-center flex flex-col items-center min-w-[220px] group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <img src="/assets/steps/success.png" alt="購入完了" className="h-72 md:h-80 lg:h-[310px] xl:h-[330px] w-[270px] object-contain object-top relative z-10 scale-on-hover" />
            </div>
          </div>
        </div>

        <div className="space-y-4 fade-in-up animate">
          <p className="text-gray-700 text-lg md:text-xl font-medium">
            QR / NFC をかざす → App Clip が即起動 → Apple Pay ワンタップ決済 → 完了
          </p>
          <p className="text-sm text-gray-500 animate-bounce">※ 画像を横スクロールしてご覧ください</p>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
}; 