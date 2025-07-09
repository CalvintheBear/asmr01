interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQAccordion({ faqs, title = "FAQ" }: FAQAccordionProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white text-center">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-gradient-to-br from-stone-800 to-gray-900 rounded-lg shadow-sm border border-stone-700 p-5"
          >
            <h3 className="text-base font-semibold text-white mb-3 leading-tight">
              {faq.question}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 