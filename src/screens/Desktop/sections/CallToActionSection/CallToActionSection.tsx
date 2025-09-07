import React from "react";

export const CallToActionSection = (): JSX.Element => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-24 md:py-32 overflow-hidden">
      <div className="section-container flex flex-col-reverse md:flex-row items-center gap-12 relative">
        {/* Left: Copy */}
        <div className="flex-1 space-y-8 text-center md:text-left fade-in-up animate">
          {/* サービス名 */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-primary-900 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
            KizunaFinder
        </h1>

          {/* 理念コピー */}
          <p className="text-3xl sm:text-4xl leading-snug font-medium animate-pulse">
            自社の製品を宣伝するインフルエンサーを探さないといけないけど、<br />
            どこから始めればいいかわからない...<br />
            <span className="font-semibold text-orange-600">そんなお悩み、ありませんか？</span>
          </p>

          <div className="inline-flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <span className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold pulse-glow">
              🤖 AIで1分で検索完了
            </span>

            <a href="https://kizunafinderfront.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary pulse-glow">
              無料で使ってみる
            </a>
          </div>
        </div>

        {/* Right: App Clip GIF */}
        <div className="flex-1 max-w-xl flex justify-center md:justify-end relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
          <img
            src="/assets/kizuna/kzfinder_demo_vert.png"
            alt="KizunaFinder Demo"
            className="rounded-2xl shadow-2xl w-full floating relative z-10 hover:scale-105 transition-transform duration-500"
          />
      </div>

        {/* Background decorations */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-primary-600/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl animate-pulse"></div>
      </div>
    </section>
  );
};