import React from "react";

export const UseCaseSection = (): JSX.Element => {
  return (
    <section id="usecase" className="py-20 bg-gradient-to-b from-white to-gray-50 section-container">
      <div className="fade-in-up animate">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
          導入シーンはいろいろ
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Hotel */}
          <div className="bg-white p-0 rounded-xl shadow-lg overflow-hidden flex flex-col card-hover group">
            <img
              src="/assets/usecase/hotel.jpg"
              alt="ホテル客室アメニティ"
              className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="p-6 flex flex-col flex-grow relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-orange-600"></div>
              <h3 className="font-bold mb-3 text-lg text-primary-900">ホテル客室アメニティ</h3>
              <p className="text-sm text-gray-600 flex-grow">
                試して気に入った瞬間に QR スキャン。手ぶらで帰宅できる新しい宿泊体験。
              </p>
            </div>
          </div>

          {/* Salon */}
          <div className="bg-white p-0 rounded-xl shadow-lg overflow-hidden flex flex-col card-hover group">
            <img
              src="/assets/usecase/salon.jpg"
              alt="美容院の店販シャンプー"
              className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="p-6 flex flex-col flex-grow relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-orange-600"></div>
              <h3 className="font-bold mb-3 text-lg text-primary-900">美容院の店販シャンプー</h3>
              <p className="text-sm text-gray-600 flex-grow">
                施術後に即購入。サロン在庫ゼロでリピート率向上。
              </p>
            </div>
          </div>

          {/* Lounge */}
          <div className="bg-white p-0 rounded-xl shadow-lg overflow-hidden flex flex-col card-hover group">
            <img
              src="/assets/usecase/lounge.jpg"
              alt="空港ラウンジ限定ギフト"
              className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="p-6 flex flex-col flex-grow relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-orange-600"></div>
              <h3 className="font-bold mb-3 text-lg text-primary-900">空港ラウンジ限定ギフト</h3>
              <p className="text-sm text-gray-600 flex-grow">
                待ち時間にスキャン→帰国後受け取り。免税品を並ばず購入可能。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 