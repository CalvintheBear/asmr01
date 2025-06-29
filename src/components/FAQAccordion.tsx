'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Minimize2, Maximize2 } from 'lucide-react';

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
  // 设置默认状态为所有FAQ都展开
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(
    new Set(faqs.map(faq => faq.id))
  );

  const toggleFaq = (faqId: string) => {
    const newExpandedFaqs = new Set(expandedFaqs);
    if (newExpandedFaqs.has(faqId)) {
      newExpandedFaqs.delete(faqId);
    } else {
      newExpandedFaqs.add(faqId);
    }
    setExpandedFaqs(newExpandedFaqs);
  };

  const toggleAll = () => {
    if (expandedFaqs.size === faqs.length) {
      // 如果全部展开，则全部折叠
      setExpandedFaqs(new Set());
    } else {
      // 否则全部展开
      setExpandedFaqs(new Set(faqs.map(faq => faq.id)));
    }
  };

  const allExpanded = expandedFaqs.size === faqs.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
        
        {/* 一键折叠/展开按钮 */}
        <button
          onClick={toggleAll}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
        >
          {allExpanded ? (
            <>
              <Minimize2 className="w-4 h-4" />
              <span className="text-sm font-medium">Collapse All</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm font-medium">Expand All</span>
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {faqs.map((faq) => {
          const isExpanded = expandedFaqs.has(faq.id);
          
          return (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-inset"
              >
                <span className="text-lg font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className={`
                  flex-shrink-0 transition-transform duration-300 
                  ${isExpanded ? 'transform rotate-180' : ''}
                `}>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              </button>
              
              <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 