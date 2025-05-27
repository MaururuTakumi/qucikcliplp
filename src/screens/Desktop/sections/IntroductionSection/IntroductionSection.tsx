import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { ChevronRight } from "lucide-react";

export const IntroductionSection = (): JSX.Element => {
  // Data for the cards to enable mapping
  const challengeCards = [
    {
      id: 1,
      iconSrc: "/---icon--cart-.png",
      iconAlt: "Icon cart",
      iconBgColor: "bg-[#1e3a8a33]",
      iconWidth: "w-[78px]",
      iconHeight: "h-[58px]",
      iconTop: "top-[13px]",
      iconLeft: "left-0.5",
      title: ["いろんな商品を展示したいけど、", "在庫リスクやスペースが", "ネック"],
      description: ["本当に売りたい商品を、", "在庫リスクで諦めていませんか？"],
    },
    {
      id: 2,
      iconSrc: "/chatgpt------2025-5-25--1.png",
      iconAlt: "Chatgpt",
      iconBgColor: "bg-[#8a811e33]",
      iconWidth: "w-[78px]",
      iconHeight: "h-[78px]",
      iconTop: "top-0",
      iconLeft: "left-px",
      title: ['お客様の"欲しい!"という', "気持ちをその場で", "売上に繋げたいが..."],
      description: ["お客様の熱意を、", "持ち帰りの手間で", "逃していませんか？"],
    },
    {
      id: 3,
      iconSrc: "/---icon--credit-card-.png",
      iconAlt: "Icon credit card",
      iconBgColor: "bg-[#558a1e33]",
      iconWidth: "w-[67px]",
      iconHeight: "h-[50px]",
      iconTop: "top-4",
      iconLeft: "left-3",
      title: ["イベントや催事で、", "持ち帰りの手間が", "購入の障壁に"],
      description: ["限定品や大型商品も、", "スマート販売しませんか？"],
    },
  ];

  return (
    <section className="relative flex flex-col w-full items-center justify-end gap-5 px-4 py-16 md:py-24 bg-[#f2f1f1] overflow-hidden">
      <div className="w-full py-10">
        <h2 className="font-['Lato',Helvetica] font-semibold text-black text-[clamp(1.75rem,3.5vw,2.5rem)] text-center leading-snug">
          こんな"もったいない"、<br className="md:hidden" />
          見過ごしてませんか？
        </h2>
      </div>

      <div 
        className="group/scroll relative w-full lg:max-w-screen-xl lg:mx-auto"
        role="group"
        aria-label="横スクロールリスト"
      >
        <div className="flex lg:grid lg:grid-cols-3 w-full overflow-x-auto lg:overflow-visible gap-4 md:gap-6 scroll-snap-x scroll-snap-mandatory touch-pan-x scroll-smooth scrollbar-hide pb-6 lg:pb-0">
          {challengeCards.map((card) => (
            <Card
              key={card.id}
              className="flex-shrink-0 lg:flex-shrink lg:w-full min-w-[calc(100vw-2rem)] sm:min-w-[60%] md:min-w-[45%] lg:min-w-0 max-w-[480px] scroll-snap-start bg-white rounded-[30px] shadow-md"
            >
              <CardContent className="p-6 md:p-8 flex flex-col gap-6 min-h-[260px] sm:min-h-[240px] lg:min-h-0">
                <div
                  className={`relative w-full max-w-[200px] mx-auto h-[70px] ${card.iconBgColor} flex items-center justify-center rounded-lg`}
                >
                  <img
                    className={`${card.iconWidth} ${card.iconHeight} ${card.id === 2 ? "object-cover" : ""}`}
                    alt={card.iconAlt}
                    src={card.iconSrc}
                  />
                </div>

                <h3 className="font-['Lato',Helvetica] font-bold text-black text-[clamp(0.9rem,3.8vw,1.25rem)] text-center leading-relaxed">
                  {card.title.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < card.title.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h3>

                <p className="font-normal text-black text-[clamp(0.85rem,3.2vw,1rem)] text-center leading-relaxed font-['Lato',Helvetica]">
                  {card.description.map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < card.description.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#f2f1f1] via-[#f2f1f1]/70 to-transparent lg:hidden group-hover/scroll:opacity-0 transition-opacity">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-2">
            <ChevronRight className="w-6 h-6 text-gray-600 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};