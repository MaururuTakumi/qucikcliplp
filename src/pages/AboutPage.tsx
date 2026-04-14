import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  React.useEffect(() => {
    document.title = '会社概要 | honkoma';
  }, []);

  const metrics = [
    { value: '20社以上', label: '導入・商談実績' },
    { value: '最短2週間', label: '初期版リリース' },
    { value: '98%', label: 'クライアント継続率' },
  ];

  const companyInfo = [
    { label: '商号', value: '株式会社honkoma' },
    { label: '設立年月日', value: '2025年7月' },
    { label: '電話番号', value: '080-8526-6978' },
    { label: 'メール', value: 'quickclip@ltdhonkoma.com' },
    { label: '資本金', value: '500,000円' },
    { label: '事業内容', value: 'AI導入支援、業務自動化支援、AIエージェント開発・派遣、ソフトウェア開発' },
    { label: '従業員数', value: '2名（創業メンバー）' },
  ];

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">About</span>
            </div>
            <div className="lg:col-span-9">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink mb-6">会社概要</h1>
              <p className="text-warm text-xl leading-relaxed max-w-2xl">
                テクノロジーの力で企業の課題を解決し、<br />
                AIと自動化で日本のビジネスを次のステージへ。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
            {[
              {
                label: '企業理念',
                title: 'テクノロジーで、人の可能性を解放する',
                body: '人がやるべきでない仕事から人を解放し、創造的な仕事に集中できる世界を実現する。それが私たちの原点です。',
              },
              {
                label: 'ミッション',
                title: 'AI導入のハードルをゼロにする',
                body: 'AIは使いたいが何から始めればいいかわからない。そんな企業に寄り添い、最適なAI活用を実現するパートナーであり続けます。',
              },
              {
                label: 'ビジョン',
                title: 'すべての企業にAIの恩恵を届ける',
                body: '大企業だけでなく、中小企業やスタートアップまで。あらゆる規模の企業がAIの力を活用できる社会を目指します。',
              },
            ].map((item, i) => (
              <div key={i} className="bg-cream p-8 md:p-12 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">{item.label}</span>
                <h3 className="font-serif text-xl font-bold text-ink mt-4 mb-4">{item.title}</h3>
                <p className="text-warm text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metric Counter — Dark Section */}
      <section className="py-28 bg-ink text-cream">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/10">
            {metrics.map((item, i) => (
              <div key={i} className="bg-ink p-8 md:p-10 text-center">
                <div className="font-serif text-5xl font-bold mb-3">
                  {item.value}
                </div>
                <p className="font-mono text-xs tracking-widest uppercase text-cream/40">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-subtle"></div>
          <span className="font-mono text-xs uppercase tracking-widest text-warm">Message</span>
          <div className="flex-1 h-px bg-subtle"></div>
        </div>
      </div>

      {/* CEO Message — Blockquote Pullquote */}
      <section className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Message</span>
            </div>
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-10">代表者メッセージ</h2>
              <div className="relative">
                {/* Decorative opening quote */}
                <span className="absolute -top-8 -left-4 font-serif text-8xl md:text-9xl text-accent/15 leading-none select-none pointer-events-none" aria-hidden="true">
                  &ldquo;
                </span>
                <div className="space-y-5 text-warm leading-relaxed relative z-10">
                  <p>
                    AIの進化は、ビジネスのあり方を根本から変えつつあります。
                    しかし、多くの企業にとって「AIをどう使えばいいのか」は依然として大きな課題です。
                  </p>
                  <p>
                    私たちhonkomaは、そのギャップを埋めるために生まれました。
                    業務自動化、AI導入支援、AIエージェントの開発・派遣を通じて、
                    企業の生産性向上と競争力強化を実現します。
                  </p>
                  <p>
                    「テクノロジーは難しい」と感じている方にこそ、私たちの価値があります。
                    技術の専門知識がなくても、御社の課題をお聞かせいただければ、
                    最適な解決策をわかりやすくご提案いたします。
                  </p>
                  <p className="text-ink font-medium">
                    AIと自動化の力で、御社のビジネスを次のレベルへ。<br />
                    私たちと一緒に、新しい働き方を創造しましょう。
                  </p>
                </div>
                {/* Decorative closing quote */}
                <span className="absolute -bottom-12 right-0 font-serif text-8xl md:text-9xl text-accent/15 leading-none select-none pointer-events-none" aria-hidden="true">
                  &rdquo;
                </span>
              </div>
              <div className="mt-14 pt-6 border-t border-subtle">
                <p className="font-mono text-xs text-warm">株式会社honkoma</p>
                <p className="font-serif text-lg font-bold text-ink mt-1">代表取締役CEO 林拓海</p>
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="/team/hayashi_img.jpg"
                  alt="CEO 林拓海"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-subtle"></div>
          <span className="font-mono text-xs uppercase tracking-widest text-warm">Company</span>
          <div className="flex-1 h-px bg-subtle"></div>
        </div>
      </div>

      {/* Company Info — Hover Table */}
      <section className="py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Company</span>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">会社情報</h2>
            </div>
          </div>

          <div className="lg:ml-[25%]">
            <div className="border-t border-subtle">
              {companyInfo.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-12 border-b border-subtle py-5 px-4 -mx-4 hover:bg-accent-light/30 transition-colors cursor-default"
                >
                  <dt className="sm:col-span-3 font-mono text-xs tracking-wide text-warm uppercase mb-1 sm:mb-0 sm:pt-0.5">
                    {item.label}
                  </dt>
                  <dd className="sm:col-span-9 text-ink text-sm leading-relaxed">
                    {item.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="max-w-[800px] mx-auto text-center px-6 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-6">
            AI導入・開発のご相談
          </h2>
          <p className="text-warm text-lg mb-10">
            御社の課題に合わせて、最適なソリューションをご提案します。
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center px-8 py-4 bg-ink text-cream font-medium tracking-wide hover:bg-accent transition-colors duration-300"
          >
            無料相談を予約する
            <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
