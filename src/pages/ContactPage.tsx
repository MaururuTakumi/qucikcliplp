import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Calendar, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { AIStarterBand } from '../features/ai-chat/components/AIStarterBand';
import { submitContactFormNotification } from '../features/ai-chat/api/client';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxVMYEL9aJS124xpDj-bpynGYH_QbyEsb0yGqUznlTALT6OreAjCSS7oth4f7ETDciQ/exec';

/* site-ia-design §3.6 / 経営方針: プラン制(AI顧問/AI秘書)・口コミAIは廃止。
 * 選択肢を新ポジショニング(AIネイティブ化の伴走)へ整理し、採用導線を追加。 */
const inquiryOptions = [
  { emoji: '🚀', label: '会社をAIネイティブにしたい（AI導入・伴走）' },
  { emoji: '⚡', label: '業務を自動化したい' },
  { emoji: '💻', label: 'プロダクト開発を依頼したい' },
  { emoji: '🏨', label: 'ホテル向けRevenue Intelligenceを相談したい' },
  { emoji: '🧑‍💻', label: '採用・カジュアル面談を希望する' },
  { emoji: '💬', label: 'その他' },
];

const employeeCountOptions = ['1〜10名', '11〜50名', '51〜100名', '100名以上'];

function currentUtm() {
  const params = new URLSearchParams(window.location.search);
  return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    .map((key) => {
      const value = params.get(key);
      return value ? `${key}=${value}` : '';
    })
    .filter(Boolean)
    .join('&') || undefined;
}

const ContactPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inquiryType, setInquiryType] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const isHotelInquiry = inquiryType.includes('ホテル向け');

  React.useEffect(() => {
    document.title = 'お問い合わせ | honkoma';
    /* /recruit からの採用導線: ?type=recruit で種別=採用をプリセットしStep2へ。 */
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'recruit') {
      setInquiryType('採用・カジュアル面談を希望する');
      setStep(2);
    }
  }, []);

  const goToStep = (next: number) => {
    setFadeKey((k) => k + 1);
    setStep(next);
  };

  const handleSelectInquiry = (label: string) => {
    setInquiryType(label);
    goToStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = {
      inquiryType,
      company,
      name,
      email,
      employeeCount,
      message,
      consent,
      timestamp: new Date().toISOString(),
    };

    const gasSubmission = fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const slackNotification = submitContactFormNotification({
      ...data,
      referrer: document.referrer || undefined,
      utm: currentUtm(),
    });

    const [gasResult, slackResult] = await Promise.allSettled([gasSubmission, slackNotification]);
    if (gasResult.status === 'rejected') {
      console.error('Error submitting form:', gasResult.reason);
    }
    if (slackResult.status === 'rejected') {
      console.error('Error notifying contact form:', slackResult.reason);
    } else if (!slackResult.value.slackNotified) {
      console.warn('Contact form Slack notification was not sent:', slackResult.value.error);
    }

    setIsSubmitting(false);
    if (window.gtag) {
      window.gtag('event', 'form_submit', { event_category: 'engagement', event_label: 'contact_form' });
    }
    goToStep(3);
  };

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

      <AIStarterBand
        source="float"
        compact
        title="フォームの前に、AIで自社活用案を見てみる。"
        body="会社サイトのURLから、honkomaならどこを自動化・売上化できるかを先に整理できます。"
      />

      {/* Contact Info */}
      <section className="border-b border-subtle">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-subtle">
            {[
              { icon: <Mail className="h-4 w-4" />, label: 'メールアドレス', value: 'quickclip@ltdhonkoma.com', sub: '24時間受付' },
              { icon: <Phone className="h-4 w-4" />, label: '電話番号', value: '080-8526-6978', sub: '平日 9:00-18:00' },
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

      {/* Step Form */}
      <section className="py-20 md:py-32">
        <div className="max-w-[720px] mx-auto px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-3 mb-16">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300 ${
                      s === step
                        ? 'bg-accent text-cream'
                        : s < step
                          ? 'bg-accent/20 text-accent'
                          : 'bg-subtle text-warm'
                    }`}
                  >
                    {s < step ? '✓' : s}
                  </div>
                  <span className={`font-mono text-[10px] tracking-wide uppercase ${s === step ? 'text-accent' : 'text-warm'}`}>
                    {s === 1 ? '相談内容' : s === 2 ? '情報入力' : '完了'}
                  </span>
                </div>
                {s < 3 && (
                  <div className={`w-12 md:w-20 h-px mb-5 transition-colors duration-300 ${s < step ? 'bg-accent' : 'bg-subtle'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Content */}
          <div key={fadeKey} className="animate-fade-in">
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-2 text-center">
                  ご相談内容を選択してください
                </h2>
                <p className="text-warm text-center mb-10">該当するものをお選びください</p>
                <div className="grid grid-cols-1 gap-4">
                  {inquiryOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelectInquiry(opt.label)}
                      className={`w-full text-left p-5 md:p-6 border transition-all duration-200 hover:border-accent hover:bg-accent-light/30 ${
                        inquiryType === opt.label
                          ? 'border-accent bg-accent-light/30'
                          : 'border-subtle bg-cream'
                      }`}
                    >
                      <span className="text-xl mr-3">{opt.emoji}</span>
                      <span className="font-serif text-ink font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-2 text-center">
                  お客様情報をご入力ください
                </h2>
                <p className="text-warm text-center mb-10">
                  <span className="inline-block border border-accent/30 bg-accent-light px-3 py-1 text-sm text-accent font-medium">
                    {inquiryType}
                  </span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label htmlFor="company" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      会社名 <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text" id="company" required value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      お名前 <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text" id="name" required value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      メールアドレス <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email" id="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs tracking-wide uppercase text-warm mb-4">
                      従業員数
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {employeeCountOptions.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center justify-center p-3 border cursor-pointer transition-all duration-200 text-sm ${
                            employeeCount === opt
                              ? 'border-accent bg-accent-light/30 text-accent font-medium'
                              : 'border-subtle text-warm hover:border-accent/50'
                          }`}
                        >
                          <input
                            type="radio" name="employeeCount" value={opt}
                            checked={employeeCount === opt}
                            onChange={(e) => setEmployeeCount(e.target.value)}
                            className="sr-only"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-mono text-xs tracking-wide uppercase text-warm mb-3">
                      {isHotelInquiry
                        ? '確認したいエリア・比較施設・通知したい変化'
                        : 'どんな業務を自動化したいですか？'} <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="message" rows={4} required value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        isHotelInquiry
                          ? '例: 博多駅周辺のホテル5〜10施設を比較したい、イベント日や競合料金の変化を通知したい など'
                          : '例: 毎日の口コミチェックに1時間かかっている、営業メールの作成を効率化したい など'
                      }
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-subtle focus:border-ink focus:ring-0 text-ink resize-none transition-colors placeholder:text-warm/50"
                    />
                  </div>

                  {/* 同意チェック(#38 §4.5 と共通の線引き。未同意では送信不可) */}
                  <label className="flex items-start gap-3 text-xs text-warm cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[color:var(--color-accent)]"
                    />
                    <span>
                      <a href="/privacy" className="text-accent hover:underline">プライバシーポリシー</a>
                      に同意の上で送信します。ご入力の個人情報は本ポリシーに基づき適切に管理いたします。
                    </span>
                  </label>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="flex items-center justify-center gap-2 px-6 py-4 border border-subtle text-warm hover:text-ink hover:border-ink transition-colors duration-200"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      戻る
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !consent}
                      className="flex-1 bg-ink text-cream py-4 font-medium tracking-wide hover:bg-accent transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-cream/30 border-t-cream rounded-full" />
                          送信中...
                        </>
                      ) : (
                        <>
                          次へ
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-accent mx-auto mb-6" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
                  お問い合わせありがとうございます
                </h2>
                <p className="text-warm text-lg mb-10">
                  24時間以内に担当者よりご連絡いたします。
                </p>

                <div className="border border-subtle p-8 md:p-10">
                  <p className="text-warm mb-4">すぐにオンライン相談をご希望の方</p>
                  <a
                    href="https://calendar.app.google/DcGsqPYBvRf3dvZJ8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-ink text-cream text-base font-medium tracking-wide hover:bg-accent transition-colors duration-300"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    オンライン無料相談を予約する
                    <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <p className="text-warm text-xs mt-3">30秒で予約完了・オンライン無料相談</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
