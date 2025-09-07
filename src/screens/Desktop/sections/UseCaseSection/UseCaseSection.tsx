import React from "react";

export const UseCaseSection = (): JSX.Element => {
  return (
    <section id="usecase" className="py-20 bg-gradient-to-b from-white to-gray-50 section-container">
      <div className="fade-in-up animate text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
          現在登録者２週間無料キャンペーン実施中！！
        </h2>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          あなたのブランドに最適なインフルエンサーをAIが見つけます。<br />
          まずはお気軽にお試しください。
        </p>

        <div className="flex justify-center">
          <a
            href="https://kizunafinderfront.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-12 py-6 rounded-xl text-2xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            こちらからチェック！
            <svg className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};