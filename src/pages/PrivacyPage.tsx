import React from 'react';
import { Shield, Mail, Eye, Lock } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'プライバシーポリシー | Honkoma';
  }, []);

  const lastUpdated = '2024年4月1日';

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-gray-50 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            プライバシーポリシー
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            株式会社Honkomaは、お客様の個人情報の保護を重要な責務と考え、<br />
            以下の方針に基づいて個人情報を適切に取り扱います。
          </p>
          <p className="text-sm text-gray-500 mt-6">
            最終更新日：{lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            
            {/* 1. 基本方針 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">1</span>
                基本方針
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed mb-0">
                  株式会社Honkoma（以下「当社」といいます。）は、当社が提供するサービスをご利用いただくお客様（以下「利用者」といいます。）の個人情報を適切に保護することが、当社の社会的責務であると考えております。当社は、個人情報の保護に関する法律、関連する政令・省令・ガイドライン等を遵守し、利用者の個人情報を適切に取り扱います。
                </p>
              </div>
            </div>

            {/* 2. 個人情報の定義 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">2</span>
                個人情報の定義
              </h2>
              <p className="text-gray-700 leading-relaxed">
                本プライバシーポリシーにおいて「個人情報」とは、個人情報の保護に関する法律第2条第1項に定義される個人情報、すなわち生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む。）をいいます。
              </p>
            </div>

            {/* 3. 個人情報の収集 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">3</span>
                個人情報の収集
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当社は、以下の方法により個人情報を収集することがあります。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>お問い合わせフォームからのご入力</li>
                <li>サービス利用時のご登録</li>
                <li>アンケート調査へのご回答</li>
                <li>イベント・セミナーへのご参加</li>
                <li>名刺交換等の営業活動</li>
                <li>Cookie等の技術を使用した自動的な情報収集</li>
              </ul>
            </div>

            {/* 4. 収集する個人情報の項目 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">4</span>
                収集する個人情報の項目
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当社が収集する個人情報の項目は以下のとおりです。
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">基本情報</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>氏名</li>
                    <li>会社名・部署名</li>
                    <li>役職</li>
                    <li>メールアドレス</li>
                    <li>電話番号</li>
                    <li>住所</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">サービス利用情報</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>IPアドレス</li>
                    <li>ブラウザの種類・バージョン</li>
                    <li>アクセス日時</li>
                    <li>利用端末情報</li>
                    <li>Cookie情報</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. 個人情報の利用目的 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">5</span>
                個人情報の利用目的
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当社は、収集した個人情報を以下の目的で利用いたします。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>お問い合わせへの対応</li>
                <li>サービスの提供・改善</li>
                <li>営業活動・マーケティング活動</li>
                <li>セミナー・イベント等のご案内</li>
                <li>統計情報の作成（個人を特定できない形式）</li>
                <li>法令に基づく対応</li>
                <li>その他、利用者との契約履行に必要な業務</li>
              </ul>
            </div>

            {/* 6. 個人情報の第三者提供 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">6</span>
                個人情報の第三者提供
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当社は、以下の場合を除き、利用者の同意なく個人情報を第三者に提供することはありません。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
                <li>利用者の同意がある場合</li>
              </ul>
            </div>

            {/* 7. 個人情報の管理 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">7</span>
                個人情報の管理
              </h2>
              <div className="bg-amber-50 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Lock className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。また、個人情報を取り扱う従業員に対して必要かつ適切な監督を行います。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Cookie等の取り扱い */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">8</span>
                Cookie等の取り扱い
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                当社のウェブサイトでは、サービスの改善やユーザー体験の向上のため、Cookie及び類似の技術を使用することがあります。
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Cookieの利用目的</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>ウェブサイトの利用状況の分析</li>
                  <li>ユーザーの利便性向上</li>
                  <li>広告配信の最適化</li>
                  <li>アクセス解析</li>
                </ul>
              </div>
            </div>

            {/* 9. 個人情報の開示・訂正・削除 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">9</span>
                個人情報の開示・訂正・削除等
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                利用者は、当社が保有する自己の個人情報について、以下の権利を有します。
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">開示請求</h4>
                  <p className="text-sm text-gray-600">保有している個人情報の開示を請求できます</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">訂正・追加・削除</h4>
                  <p className="text-sm text-gray-600">個人情報の訂正・追加・削除を請求できます</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">利用停止</h4>
                  <p className="text-sm text-gray-600">個人情報の利用停止を請求できます</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">第三者提供停止</h4>
                  <p className="text-sm text-gray-600">第三者への提供停止を請求できます</p>
                </div>
              </div>
            </div>

            {/* 10. お問い合わせ窓口 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">10</span>
                お問い合わせ窓口
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">個人情報に関するお問い合わせ</h4>
                    <p className="text-gray-700 mb-4">
                      個人情報の取り扱いに関するご質問、開示・訂正・削除等のご請求は、以下の窓口までお問い合わせください。
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>会社名：</strong>株式会社Honkoma</p>
                      <p><strong>所在地：</strong>〒150-0000 東京都渋谷区（詳細は後日公開）</p>
                      <p><strong>メール：</strong>privacy@honkoma.co.jp</p>
                      <p><strong>受付時間：</strong>平日 9:00-18:00（土日祝日を除く）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 11. プライバシーポリシーの変更 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-600 text-white rounded-full text-sm font-bold mr-4">11</span>
                プライバシーポリシーの変更
              </h2>
              <div className="bg-orange-50 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Eye className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      当社は、法令の変更や事業内容の変更等に伴い、本プライバシーポリシーを変更する場合があります。変更後のプライバシーポリシーは、当社ウェブサイトに掲載した時点で効力を生じるものとします。重要な変更については、ウェブサイト上での告知またはその他の適切な方法により、利用者にお知らせいたします。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 施行日 */}
            <div className="border-t border-gray-200 pt-8">
              <div className="text-center">
                <p className="text-gray-600 mb-2">本プライバシーポリシーは、{lastUpdated}から施行いたします。</p>
                <p className="text-sm text-gray-500">株式会社Honkoma</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;