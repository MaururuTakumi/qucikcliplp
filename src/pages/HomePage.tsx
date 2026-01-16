import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Home, Heart, Smartphone, CheckCircle } from 'lucide-react';
import akastaIcon from '../static/akasta_app_icon.png';
import helperlyLogo from '../static/helperly.png';
import heroBg from '../static/hero_bg.png';

const HomePage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Honkoma | 本当に困っている人の力になる';
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white max-w-4xl mb-8 drop-shadow-lg">
              <span className="text-primary-300">本当に困っている人</span>の<br />
              力になる。
            </h1>

            <p className="text-lg sm:text-xl text-gray-100 leading-relaxed max-w-2xl mb-12 drop-shadow-md">
              日本での教育支援、フィリピンでの生活支援。<br />
              私たちはテクノロジーの力で、それぞれの場所にある<br className="hidden sm:block" />
              「切実なニーズ」に応えるソリューションを提供します。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg">
              <a
                href="#akasta"
                className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group w-full sm:w-auto"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                アカスタ (教育)
              </a>
              <a
                href="#helperly"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto"
              >
                <Home className="mr-2 h-5 w-5" />
                Helperly (生活)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-8">
            <Heart className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            その課題解決は、<br />
            誰かの人生を少しでも良くするか。
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            私たちが事業を作る基準はシンプルです。<br />
            それは、「本当に困っている人の助けになるか」ということ。<br />
            国境を越え、領域を越え、本質的な価値を提供し続けます。
          </p>
        </div>
      </section>

      {/* Akasta Section */}
      <section id="akasta" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                Education / Japan
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Akasta (アカスタ)
              </h2>
              <h3 className="text-2xl font-bold text-gray-700">
                必要な学習を、必要なタイミングで。
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                中学受験を中心とした学習ニーズを持つ家庭と、東大生をはじめとする優秀な大学生講師をマッチング。<br />
                「テスト前だけ」「苦手単元だけ」といったスポットでの利用を可能にし、
                従来の家庭教師サービスの「高額・固定契約」という常識を変えます。
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span>入会金・解約金なしの完全スポット利用</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span>東大生を中心とした厳選された講師陣</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span>オンライン・対面の柔軟な指導形態</span>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://prosta-lp.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 font-bold text-lg hover:underline"
                >
                  サービス詳細を見る (LP)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <div className="mt-4">
                  <a
                    href="https://apps.apple.com/jp/app/%E3%82%A2%E3%82%AB%E3%82%B9%E3%82%BF/id6757215353"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    App Storeでダウンロード
                  </a>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-500">
                <img
                  src={akastaIcon}
                  alt="Akasta App Icon"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helperly Section */}
      <section id="helperly" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                Life Support / Philippines
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Helperly
              </h2>
              <h3 className="text-2xl font-bold text-gray-700">
                暮らしの困りごとを、タップひとつで解決。
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                フィリピン・セブ島を拠点とする生活支援サービスのマッチングプラットフォーム。<br />
                清掃、家事代行、ベビーシッターなど、信頼できるワーカーをアプリで簡単に検索・予約。<br />
                現地で暮らす日本人や外国人の生活を強力にサポートします。
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>アプリ完結の予約・チャット・決済</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>日本語・英語・現地語対応</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span>ワーカーの柔軟な働き方を支援</span>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://apps.apple.com/jp/app/helperly-ph/id6755625986"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  App Storeでダウンロード
                </a>
              </div>
            </div>
            {/* Helperly Image Container - Adjusted for landscape */}
            <div className="flex-1 flex justify-center w-full">
              <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-105 duration-500 bg-gray-50 border border-gray-100 p-2">
                <img
                  src={helperlyLogo}
                  alt="Helperly Logo"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            事業についてのご相談・お問い合わせ
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed opacity-95">
            アカスタ、Helperlyの事業提携や、<br />
            株式会社Honkomaへの取材・お問い合わせはこちらから。
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-primary-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              お問い合わせ
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
