import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Award, Shield, DollarSign, Smartphone } from 'lucide-react';
import akastaIcon from '../static/akasta_app_icon.png';
import helperlyLogo from '../static/helperly.png';

const ProductPage: React.FC = () => {
  React.useEffect(() => {
    document.title = '事業紹介 | Honkoma';
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            事業紹介
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            私たちは、テクノロジーと人をつなぎ、<br />
            教育と生活の現場にある「不便」を「快適」に変えていきます。
          </p>
        </div>
      </section>

      {/* Akasta Section */}
      <section id="akasta" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            Education Tech
          </div>

          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-4">
                  <img src={akastaIcon} alt="Akasta Icon" className="w-16 h-16 rounded-2xl shadow-md object-cover" />
                  Akasta (アカスタ)
                </h2>
                <p className="text-2xl text-blue-600 font-bold mb-4">
                  必要な時に、必要なだけ。<br />
                  東大生講師によるスポット家庭教師。
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  「テスト前だけ教えてほしい」「苦手なこの単元だけ復習したい」。
                  そんなニーズに対して、従来の塾や家庭教師は月額固定や長期契約が前提で、柔軟に応えられていませんでした。
                  Akastaは、1回単位で依頼できるスポット型マッチングで、この課題を解決します。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">完全スポット利用</h4>
                  <p className="text-sm text-gray-600">入会金や解約金は一切不要。1回だけの利用も、毎週の利用も自由自在です。</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <Award className="h-8 w-8 text-blue-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">厳選された講師陣</h4>
                  <p className="text-sm text-gray-600">東大生を中心とした、学力と指導力を兼ね備えた学生講師が在籍しています。</p>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://prosta-lp.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  サービスサイトへ
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">利用の流れ</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">1</div>
                    <div>
                      <h4 className="font-bold text-gray-900">アプリで講師を検索</h4>
                      <p className="text-sm text-gray-600">科目や希望日時、予算に合わせて講師を探します。</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">2</div>
                    <div>
                      <h4 className="font-bold text-gray-900">予約・支払い</h4>
                      <p className="text-sm text-gray-600">アプリ内で予約と決済が完結。面倒な手続きはありません。</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">3</div>
                    <div>
                      <h4 className="font-bold text-gray-900">授業実施</h4>
                      <p className="text-sm text-gray-600">オンラインまたは対面で、質の高い指導を受けられます。</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helperly Section */}
      <section id="helperly" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-8">
            Life Support Tech
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-16 items-start">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-4">
                  <img src={helperlyLogo} alt="Helperly Logo" className="w-auto h-12 object-contain" />
                  Helperly (ヘルパリー)
                </h2>
                <p className="text-2xl text-green-600 font-bold mb-4">
                  セブ島での暮らしを、もっと快適に。<br />
                  安心の生活支援プラットフォーム。
                </p>
                <p className="text-gray-600 leading-relaxed text-lg">
                  フィリピン・セブ島における生活者の「困った」を解決します。
                  清掃、洗濯、ベビーシッターなど、日常の家事を信頼できるワーカーに依頼できるマーケットプレイス型アプリです。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <Shield className="h-8 w-8 text-green-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">安心・安全への配慮</h4>
                  <p className="text-sm text-gray-600">ワーカーのプロフィールやレビューを事前に確認可能。安心して依頼できます。</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <DollarSign className="h-8 w-8 text-green-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">透明な料金体系</h4>
                  <p className="text-sm text-gray-600">事前に料金が明確に提示され、アプリ内で決済完結。現地での現金トラブルを防ぎます。</p>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://apps.apple.com/jp/app/helperly-ph/id6755625986"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  App Storeでダウンロード
                </a>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">提供サービス</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-700">清掃・ハウスクリーニング</span>
                  </div>
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-700">洗濯代行</span>
                  </div>
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-700">ベビーシッター</span>
                  </div>
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-gray-700">家事サポート全般</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ビジネスに関するお問い合わせ
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            各事業の詳細や協業のご相談など、お気軽にお問い合わせください。
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            お問い合わせフォームへ
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
