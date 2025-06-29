import React from 'react';

interface GuideCard {
  id: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  expandedContent: React.ReactNode;
}

interface SimpleGuideCardsProps {
  cards: GuideCard[];
}

export default function SimpleGuideCards({ cards }: SimpleGuideCardsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <article 
            key={card.id}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
          >
            <header className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-tight">
                {card.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm mb-4">
                {card.subtitle}
              </p>
            </header>
            
            <section className="mb-6">
              {card.content}
            </section>
            
            <section className="border-t border-gray-100 pt-6">
              {card.expandedContent}
            </section>
          </article>
        ))}
      </div>
    </section>
  );
} 