import React, { useState } from 'react';
import { Mail, Clock, Send, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  React.useEffect(() => {
    document.title = 'お問い合わせ | Honkoma';
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      department: formData.get('department') as string,
      inquiryType: formData.get('inquiryType') as string,
      message: formData.get('message') as string,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxVMYEL9aJS124xpDj-bpynGYH_QbyEsb0yGqUznlTALT6OreAjCSS7oth4f7ETDciQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSubmitStatus('success');
      e.currentTarget.reset();
      if (window.gtag) {
        window.gtag('event', 'form_submit', { event_category: 'engagement', event_label: 'contact_form' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('success');
      e.currentTarget.reset();
      if (window.gtag) {
        window.gtag('event', 'form_submit', { event_category: 'engagement', event_label: 'contact_form' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inquiryTypes = [
    'AI導入に関するご相談',
    'ルーティーンワーク自動化のご相談',
    'AIツール（Claude Code・OpenClaw等）導入のご相談',
    'ソフトウェア開発のご依頼',
    '事業提携・パートナーシップについて',
    'その他',
  ];

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="py-24 md:py-32 border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-warm">Contact</span>
            </div>
            <div className="lg:col-span-9">
              <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink mb-6">お問い合わせ</h1>
              <p className="text-warm text-xl leading-relaxed">
                AI導入・業務自動化・開発に関するご相談、<br />
                お気軽にお問い合わせください。初回相談は無料です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
            {[
              { icon: <Mail className="h-4 w-4" />, label: 'メールアドレス', value: 'quickclip@ltdhonkoma.com', sub: '24時間受付' },
              { icon: <Clock className="h-4 w-4" />, label: '営業時間', value: '平日 9:00-18:00', sub: '土日祝日を除く' },
              { icon: <MessageSquare className="h-4 w-4" />, label: '初回相談', value: '無料', sub: 'オンライン対応可' },
            ].map((item, i) => (
              <div key={i} className="bg-cream p-8 md:p-10">
                <div className="flex items-center gap-2 text-warm mb-3">
                  {item.icon}
                  <span className="font-mono text-xs tracking-[0.2em] uppercase">{item.label}</span>
                </div>
                <p className="font-serif text-xl font-bold text-ink">{item.value}</p>
                <p className="text-warm text-sm mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Form */}
            <div className="lg:col-span-7">
              <h2 className="font-serif text-3xl font-bold text-ink mb-2">お問い合わせフォーム</h2>
              <p className="text-warm mb-10">
                下記フォームに必要事項をご記入の上、送信してください。<br />
                担当者より2営業日以内にご連絡いたします。
              </p>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      お名前 <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text" id="name" name="name" required
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      メールアドレス <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email" id="email" name="email" required
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="company" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      会社名 <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text" id="company" name="company" required
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="department" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      部署名
                    </label>
                    <input
                      type="text" id="department" name="department"
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                    お問い合わせ種別 <span className="text-accent">*</span>
                  </label>
                  <select
                    id="inquiryType" name="inquiryType" required
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">選択してください</option>
                    {inquiryTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                    お問い合わせ内容 <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="message" name="message" rows={5} required
                    placeholder="ご相談内容の詳細をお聞かせください"
                    className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink resize-none transition-colors placeholder:text-subtle"
                  ></textarea>
                </div>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 text-ink border border-subtle p-4">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span className="text-sm">お問い合わせを受け付けました。担当者より連絡させていただきます。</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-ink border border-accent p-4">
                    <AlertCircle className="h-4 w-4 text-accent" />
                    <span className="text-sm">送信に失敗しました。時間をおいて再度お試しください。</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-ink text-cream py-4 font-medium tracking-wide hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-cream/30 border-t-cream rounded-full"></div>
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      送信する
                    </>
                  )}
                </button>

                <p className="text-xs text-warm text-center">
                  送信いただいた個人情報は、当社の
                  <a href="/privacy" className="text-accent hover:underline">プライバシーポリシー</a>
                  に基づいて適切に管理いたします。
                </p>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-5 space-y-8">
              <div className="border border-subtle p-8">
                <h3 className="font-serif text-xl font-bold text-ink mb-6">ご相談の流れ</h3>
                <div className="space-y-6">
                  {[
                    { n: '01', t: 'フォーム送信', d: '御社の状況やお悩みをお聞かせください' },
                    { n: '02', t: '無料ヒアリング', d: 'オンラインで詳しくお話をお伺いします（約30分）' },
                    { n: '03', t: 'ご提案', d: '御社に最適なAI活用プランをご提示します' },
                  ].map((item) => (
                    <div key={item.n} className="flex gap-4">
                      <span className="font-mono text-sm text-warm w-6 flex-shrink-0">{item.n}</span>
                      <div>
                        <h4 className="font-serif font-bold text-ink text-sm">{item.t}</h4>
                        <p className="text-warm text-xs mt-1">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-subtle p-8">
                <h3 className="font-serif text-lg font-bold text-ink mb-4">こんなご相談に対応</h3>
                <ul className="space-y-3">
                  {[
                    '日常業務の自動化で工数を削減したい',
                    'AIを使いたいが何から始めたらいいかわからない',
                    'Claude CodeやOpenClawを社内に導入したい',
                    '開発プロジェクトを依頼したい',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0 mt-2"></span>
                      <span className="text-warm text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-accent-light border border-accent/20 p-8">
                <h3 className="font-serif text-lg font-bold text-ink mb-2">初回相談無料</h3>
                <p className="text-warm text-sm leading-relaxed">
                  まずはお気軽にお問い合わせください。御社の状況をお伺いした上で、最適なプランをご提案いたします。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
