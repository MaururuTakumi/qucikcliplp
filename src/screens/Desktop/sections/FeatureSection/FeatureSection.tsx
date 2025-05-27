import React from "react";

// Feature step data for mapping
const featureSteps = [
  {
    id: 1,
    title: "発見&スキャン",
    description: "商品や展示物のQRコードをスキャン",
    icon: "📱",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    id: 2,
    title: "確認&決済",
    description: "ワンタップで簡単に決済完了",
    icon: "💳",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
  },
  {
    id: 3,
    title: "自宅で受け取り",
    description: "商品は自宅に直接配送",
    icon: "🚚",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
];

export const FeatureSection = (): JSX.Element => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden" aria-labelledby="features-heading">
      <div className="section-container relative z-10">
        {/* Header */}
        <header className="text-center mb-20 fade-in-up animate">
          <h2 id="features-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent mb-6">
            たった3ステップの簡単フロー
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            誰でも簡単に、わずか数秒で完了する革新的な購買体験
          </p>
        </header>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12" role="list" aria-label="機能ステップ一覧">
          {featureSteps.map((step, index) => (
            <article
              key={step.id}
              className={`group relative bg-gradient-to-br ${step.bgGradient} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 card-hover`}
              style={{ animationDelay: `${index * 200}ms` }}
              role="listitem"
            >
              {/* Background decoration */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} aria-hidden="true"></div>
              
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center" aria-label={`ステップ${step.id}`}>
                <span className={`text-lg font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                  {step.id}
                </span>
              </div>

              {/* Icon circle */}
              <div className="flex justify-center mb-8">
                <div className={`w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 relative`} role="img" aria-label={`${step.title}のアイコン`}>
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" aria-hidden="true"></div>
                  <span className="text-3xl relative z-10" aria-hidden="true">{step.icon}</span>
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-900 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {step.description}
                </p>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true"></div>
            </article>
          ))}
        </div>

        {/* Connection lines for desktop */}
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl" aria-hidden="true">
          <div className="flex justify-between items-center px-20">
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse" aria-hidden="true"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl animate-pulse" aria-hidden="true"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl animate-pulse" aria-hidden="true"></div>
    </section>
  );
};
