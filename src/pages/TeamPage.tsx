import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Mail, ArrowRight, ArrowUpRight } from 'lucide-react';

const TeamPage: React.FC = () => {
  React.useEffect(() => {
    document.title = 'メンバー紹介 | honkoma';
  }, []);

  const teamMembers = [
    {
      name: '林拓海',
      nameEn: 'Takumi Hayashi',
      position: '代表取締役CEO',
      image: '/team/hayashi_img.jpg',
      bio: '西大和学園高等学校卒業後、東京大学文科一類に入学。現在は農学部農業資源経済学専修に所属。在学中よりFintechスタートアップでビジネスディベロップメントとして法人営業に従事し、ビジネスと技術の橋渡し役として活躍。現在は事業会社のM&Aチームにも参画し、事業開発と経営戦略の両面から企業価値創造に取り組む。',
      message: 'AI時代の到来とともに、企業が直面する「何から始めればいいかわからない」という課題は急速に拡大しています。私たちhonkomaは、その最前線に立ち、業務自動化やAI導入を通じて企業の変革を支援します。テクノロジーの力で、すべての企業がAIの恩恵を受けられる世界を目指して挑戦し続けます。',
      social: {
        email: 'quickclip@ltdhonkoma.com',
        linkedin: '',
        twitter: 'https://x.com/moriyorihayash1?s=21&t=PxD9VDUOatoEBmRjBGZnQw',
      },
    },
    {
      name: '中島幸祐',
      nameEn: 'Kosuke Nakajima',
      position: '共同創業者・エンジニア',
      image: '/team/nakajima_img.jpg',
      bio: '2022年に東京大学文科一類に入学後経済学部に進学。部活動を通じてPythonとTypeScriptを習得し、プログラミングの世界に魅了される。在学中にスタートアップ2社でエンジニアとしてのインターンを経験し、実践的な開発スキルを磨く。AI関連ツールの深い知見を持ち、Claude CodeやOpenClawを活用した開発手法に精通。',
      message: 'エンジニアとして日々最前線でAIツールを活用する中で、その圧倒的なポテンシャルを実感しています。Claude Codeでの開発効率化、OpenClawでの業務自動化、これらのツールを正しく活用すれば、チームの生産性は桁違いに向上します。その「正しい活用法」を、御社のチームに合わせてお伝えするのが私たちの役割です。',
      social: {
        email: 'quickclip@ltdhonkoma.com',
        linkedin: 'https://www.linkedin.com/in/kosuke-nakajima-05a115352',
        twitter: 'https://x.com/knbaseballstd',
      },
    },
  ];

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Team</span>
            </div>
            <div className="lg:col-span-9">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink mb-6">メンバー紹介</h1>
              <p className="text-warm text-xl leading-relaxed">
                AIと自動化の最前線で活動する<br />
                Honkomaのメンバーをご紹介します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Members */}
      {teamMembers.map((member, index) => (
        <section key={index} className="py-32 border-b border-subtle">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-16 items-start ${index % 2 === 1 ? '' : ''}`}>
              {/* Photo */}
              <div className={`lg:col-span-4 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                {/* Social */}
                <div className="flex gap-4 mt-6">
                  <a
                    href={`mailto:${member.social.email}`}
                    className="w-10 h-10 border border-subtle flex items-center justify-center text-warm hover:text-ink hover:border-ink transition-all"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      className="w-10 h-10 border border-subtle flex items-center justify-center text-warm hover:text-ink hover:border-ink transition-all"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      className="w-10 h-10 border border-subtle flex items-center justify-center text-warm hover:text-ink hover:border-ink transition-all"
                      aria-label="X (Twitter)"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className={`lg:col-span-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">{member.position}</span>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink mt-3 mb-1">
                  {member.name}
                </h2>
                <p className="font-mono text-sm text-warm mb-10">{member.nameEn}</p>

                <div className="border-t border-subtle pt-8 mb-10">
                  <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-4">略歴</h3>
                  <p className="text-warm leading-relaxed">{member.bio}</p>
                </div>

                <div className="border-t border-subtle pt-8">
                  <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-warm mb-4">メッセージ</h3>
                  <blockquote className="border-l-2 border-accent pl-6 text-ink leading-relaxed italic">
                    {member.message}
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Team Message */}
      <section className="py-32 bg-ink">
        <div className="max-w-[800px] mx-auto px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream text-center mb-10">
            私たちからのメッセージ
          </h2>
          <div className="space-y-6 text-center">
            <p className="text-cream/60 text-lg leading-relaxed">
              私たちHonkomaは、異なる専門性とバックグラウンドを持ちながらも、
              「テクノロジーで人の可能性を解放する」という共通の理念で結ばれたチームです。
            </p>
            <p className="text-cream/60 leading-relaxed">
              AIと自動化という急速に進化する領域で、
              御社のビジネスに最適なソリューションを提案し、
              共に成長していくパートナーでありたいと考えています。
            </p>
            <p className="text-cream font-serif text-lg font-medium pt-4">
              私たちと一緒に、AIで新しいビジネスの可能性を拓きませんか。
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="max-w-[800px] mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-6">
            お気軽にご相談ください
          </h2>
          <p className="text-warm text-lg mb-10">
            AI導入・業務自動化・開発に関するご相談を承っています。
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center px-8 py-4 bg-ink text-cream font-medium tracking-wide hover:bg-accent transition-colors duration-300"
          >
            お問い合わせはこちら
            <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
