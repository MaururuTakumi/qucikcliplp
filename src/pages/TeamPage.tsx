import React from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const TeamPage: React.FC = () => {
  React.useEffect(() => {
    document.title = '役員紹介 | Honkoma';
  }, []);

  const teamMembers = [
    {
      name: '林拓海',
      nameEn: 'Takumi Hayashi',
      position: '代表取締役CEO',
      image: '/src/static/hayashi_img.jpg',
      bio: '西大和学園高等学校卒業後、東京大学文科一類に入学。現在は農学部農業資源経済学専修に所属。在学中よりFintechスタートアップでビジネスディベロップメントとして法人営業に従事し、ビジネスと技術の橋渡し役として活躍。現在は事業会社のM&Aチームにも参画し、事業開発と経営戦略の両面から企業価値創造に取り組む。',
      message: '日本のIT業界が直面するエンジニア不足と、インドの優秀な若手エンジニアの可能性。この両者を適切に結びつけることで、真のWin-Winを実現したいと考えています。重要なのは、大学のブランドではなく実際のスキルと人柄。現地ネットワークとAI技術を組み合わせ、「本当に戦力になる人材」を丁寧に見極める仕組みを構築しました。適正なコスト設計で、長期的にフェアな関係を築いていきます。',
      social: {
        email: 'quickclip@ltdhonkoma.com',
        linkedin: '',
        twitter: 'https://x.com/moriyorihayash1?s=21&t=PxD9VDUOatoEBmRjBGZnQw'
      }
    },
    {
      name: '中島幸祐',
      nameEn: 'Kosuke Nakajima',
      position: '共同創業者・エンジニア',
      image: '/src/static/nakajima_img.jpg',
      bio: '2022年に東京大学文科一類に入学後経済学部に進学。部活動を通じてPythonとTypeScriptを習得し、プログラミングの世界に魅了される。在学中にスタートアップ2社でエンジニアとしてのインターンを経験し、実践的な開発スキルを磨く。AIスクリーニングツールの開発と、技術評価の仕組み設計を担当。',
      message: 'エンジニアとして、スキル評価の難しさを身をもって経験してきました。大学名や経歴だけでは測れない実力を、どう正確に見極めるか。この課題に対し、AIと人の目を組み合わせたスクリーニングツールを開発しました。技術者として、真に実力のあるエンジニアが正当に評価される仕組みを作りたいと考えています。',
      social: {
        email: 'quickclip@ltdhonkoma.com',
        linkedin: 'https://www.linkedin.com/in/kosuke-nakajima-05a115352?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
        twitter: 'https://x.com/knbaseballstd?s=21&t=PxD9VDUOatoEBmRjBGZnQw'
      }
    },
    {
      name: '谷口俊哉',
      nameEn: 'Shunya Taniguchi',
      position: '最高技術責任者（CTO）',
      image: '/team/taniguchi.jpg', // 仮置き
      bio: '(準備中)',
      message: 'AIスクリーニングツールの技術責任者として、精度と説明責任の両立を追求しています。単に効率化するだけでなく、なぜその評価になったのかを明確に示すこと。生成AIのコピペを見抜く仕組みを組み込むこと。技術的な卓越性を追求しながら、人事担当者が信頼して使えるツールを創り上げていきます。',
      social: {
        email: 'quickclip@ltdhonkoma.com',
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-gray-50 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            役員紹介
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Honkomaを牽引する経営陣をご紹介いたします。<br />
            多様なバックグラウンドを持つメンバーが、共通のビジョンのもとに結集しています。
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {teamMembers.map((member, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Photo */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative max-w-md mx-auto">
                    <div className="aspect-square bg-gradient-to-br from-primary-100 to-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                      {member.image && !member.image.includes('taniguchi') ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600 text-sm">{member.name}</p>
                            <p className="text-gray-500 text-xs">写真準備中</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Background decoration */}
                    <div className="absolute -z-10 top-8 left-8 w-full h-full bg-primary-600/10 rounded-2xl"></div>
                  </div>
                </div>

                {/* Info */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div>
                    <div className="inline-flex items-center bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      {member.position}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">{member.nameEn}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">略歴</h3>
                      <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">メッセージ</h3>
                      <blockquote className="border-l-4 border-primary-600 pl-6 italic text-gray-700 leading-relaxed">
                        "{member.message}"
                      </blockquote>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="flex space-x-4">
                    <a
                      href={`mailto:${member.social.email}`}
                      className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 hover:bg-primary-600 hover:text-white transition-colors duration-200"
                      aria-label={`${member.name}にメールを送る`}
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social.linkedin}
                      className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 hover:bg-primary-600 hover:text-white transition-colors duration-200"
                      aria-label={`${member.name}のLinkedInプロフィール`}
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-gray-600 hover:bg-primary-600 hover:text-white transition-colors duration-200"
                      aria-label={`${member.name}のTwitterプロフィール`}
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Message Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-8">
            私たちからのメッセージ
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white">
            <p className="text-xl leading-relaxed mb-6">
              私たちHonkomaは、それぞれが異なる専門性とバックグラウンドを持ちながらも、
              「本当に困っている人の力になる」という共通の理念で結ばれたチームです。
            </p>
            <p className="text-lg leading-relaxed mb-6">
              App Clipという革新的なテクノロジーを活用して、
              従来の購買体験の課題を根本から解決し、
              すべての人にとってより良い商業体験を提供したいと考えています。
            </p>
            <p className="text-lg leading-relaxed font-semibold">
              私たちと一緒に、新しい未来を創造していきませんか。
            </p>
          </div>
        </div>
      </section>

      {/* Awards/Achievements Placeholder */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">メンバーの実績・受賞歴</h2>
            <p className="text-lg text-gray-600">
              今後、メンバーの実績や受賞歴をこちらに掲載予定です。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">プロダクト開発実績</h3>
              <p className="text-sm text-gray-600">複数のB2Cサービス立ち上げ経験</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">学術的背景</h3>
              <p className="text-sm text-gray-600">東京大学での学術的基盤</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">💻</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">技術的専門性</h3>
              <p className="text-sm text-gray-600">HR系含む数社での開発経験</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;