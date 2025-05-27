import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const StepsSection = (): JSX.Element => {
  // Customer benefits data
  const customerBenefits = [
    {
      id: 1,
      icon: "/vector.svg",
      iconBg: "bg-[#b3fdf866]",
      title: "手ぶらで快適な購買体験",
      description: "商品を持ち歩く必要がなく、観光や買い物がより快適に。",
    },
    {
      id: 2,
      icon: "/---icon--credit-card--1.png",
      iconBg: "bg-[#fecfae33]",
      title: "簡単・スピーディーな瞬間購入",
      description: "アプリ不要でQRコードをスキャンするだけの簡単決済。",
    },
  ];

  // Facility benefits data
  const facilityBenefits = [
    {
      id: 1,
      icon: "/-------2025-5-25--2.png",
      iconBg: "bg-[#b3fdf866]",
      title: "在庫リスクゼロで新たな収益機会",
      description: "実物の在庫を持たずに販売が可能で、スペースを有効活用。",
    },
    {
      id: 2,
      icon: "/-------2025-5-25--21-17-56--2.png",
      iconBg: "bg-[#fecfae33]",
      title: "簡単オペレーションで売上向上",
      description: "QRコードを設置するだけで、新たな収益チャネルを構築。",
    },
  ];

  return (
    <section className="flex flex-col w-full items-center justify-end gap-[54px] px-6 py-8 bg-[#f2f2f2]">
      <h2 className="w-full [font-family:'Lato',Helvetica] font-semibold text-black text-[45px] text-center leading-normal">
        Quick Clipが、その"もったいない"を解消します！！
      </h2>

      <div className="w-full py-8">
        <p className="w-full max-w-4xl mx-auto [font-family:'Lato',Helvetica] font-normal text-[#373636] text-2xl text-center leading-relaxed">
          店頭や展示商品に設置されたQR/NFCコードをスマートフォンでスキャンするだけ。アプリ不要で即座に商品詳細ページへアクセス、Apple Pay/Google Payでワンタップ決済。商品は後日ご自宅へ配送される、新しい発見型コマースです。
        </p>
      </div>

      {/* Horizontal scroll container for mobile */}
      <div className="w-full overflow-hidden">
        <div className="flex md:flex-row overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 md:pb-0 -mr-6 md:mr-0">
          {/* Customer Benefits Section */}
          <div className="w-[90vw] md:w-1/2 flex-shrink-0 snap-center px-4 md:px-4">
            <div className="bg-white rounded-[30px] p-8 h-full">
              <h3 className="font-bold text-black text-2xl leading-normal [font-family:'Lato',Helvetica] tracking-[0] text-center mb-8">
                お客様にとってのメリット
              </h3>
              <div className="flex flex-col gap-6">
                {customerBenefits.map((benefit) => (
                  <Card
                    key={benefit.id}
                    className="w-full rounded-[30px] overflow-hidden bg-gray-50"
                  >
                    <CardContent className="flex items-start gap-6 p-6">
                      <div className={`w-[63px] h-[63px] flex items-center justify-center ${benefit.iconBg} rounded-lg`}>
                        <img className="w-[40px] h-[40px]" alt="Benefit icon" src={benefit.icon} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-xl leading-normal [font-family:'Lato',Helvetica] tracking-[0] mb-2">
                          {benefit.title}
                        </h4>
                        <p className="font-normal text-black text-lg leading-relaxed [font-family:'Lato',Helvetica] tracking-[0]">
                          {benefit.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Facility Benefits Section */}
          <div className="w-[90vw] md:w-1/2 flex-shrink-0 snap-center px-4 md:px-4">
            <div className="bg-white rounded-[30px] p-8 h-full">
              <h3 className="font-bold text-black text-2xl leading-normal [font-family:'Lato',Helvetica] tracking-[0] text-center mb-8">
                施設様にとってのメリット
              </h3>
              <div className="flex flex-col gap-6">
                {facilityBenefits.map((benefit) => (
                  <Card
                    key={benefit.id}
                    className="w-full rounded-[30px] overflow-hidden bg-gray-50"
                  >
                    <CardContent className="flex items-start gap-6 p-6">
                      <div className={`w-[63px] h-[63px] flex items-center justify-center ${benefit.iconBg} rounded-lg`}>
                        <img className="w-[40px] h-[40px] object-cover" alt="Benefit icon" src={benefit.icon} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-xl leading-normal [font-family:'Lato',Helvetica] tracking-[0] mb-2">
                          {benefit.title}
                        </h4>
                        <p className="font-normal text-black text-lg leading-relaxed [font-family:'Lato',Helvetica] tracking-[0]">
                          {benefit.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};