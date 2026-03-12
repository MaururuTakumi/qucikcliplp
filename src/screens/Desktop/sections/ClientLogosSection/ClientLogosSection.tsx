import React from "react";

const clients = [
  {
    name: "BuySell Technologies",
    logo: "/assets/clients/buysell-technologies.jpg",
    alt: "株式会社BuySell Technologies",
  },
  // 今後追加するクライアントはここに追加
];

export const ClientLogosSection = (): JSX.Element => {
  return (
    <section className="py-16 md:py-20 bg-white" aria-label="導入実績">
      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-12 fade-in-up animate">
          <p className="text-sm font-semibold tracking-widest text-primary-600 uppercase mb-3">
            Trusted By
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            導入実績
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-600 to-primary-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Logo Grid */}
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center p-6 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-500 hover:scale-110"
            >
              <img
                src={client.logo}
                alt={client.alt}
                className="h-12 md:h-16 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
