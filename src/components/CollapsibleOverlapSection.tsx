'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSection {
  id: string;
  title: string;
  subtitle: string;
  collapsedContent: React.ReactNode;
  expandedContent: React.ReactNode;
  bgGradient: string;
  titleColor: string;
  borderColor: string;
}

interface CollapsibleOverlapSectionProps {
  sections: CollapsibleSection[];
}

export default function CollapsibleOverlapSection({ sections }: CollapsibleOverlapSectionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="relative">
        {sections.map((section, index) => {
          const isExpanded = expandedSection === section.id;
          const isStacked = expandedSection && expandedSection !== section.id;
          
          return (
            <div
              key={section.id}
              className={`
                relative transition-all duration-500 ease-out cursor-pointer
                ${index > 0 ? '-mt-8' : ''} 
                ${isStacked ? 'transform scale-95 opacity-60 pointer-events-none' : ''}
              `}
              style={{
                zIndex: isExpanded ? 50 : 30 - index,
                transformOrigin: 'top center',
                ...(isStacked && { 
                  transform: `translateY(${index * 4}px) scale(0.95)`,
                  filter: 'blur(1px)'
                }),
                ...(isExpanded && {
                  transform: 'translateY(-10px) scale(1.02)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                })
              }}
              onClick={() => toggleSection(section.id)}
            >
              <div className={`
                ${section.bgGradient} 
                rounded-3xl shadow-xl border-2 overflow-hidden backdrop-blur-sm
                transition-all duration-500 ease-out
                hover:shadow-2xl hover:scale-[1.01]
                ${isExpanded ? 'border-emerald-500 shadow-2xl' : section.borderColor}
              `}>
                {/* Header - Always Visible */}
                <div className="p-8 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className={`text-2xl md:text-3xl font-semibold ${section.titleColor} mb-3`}>
                        {section.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed max-w-3xl">
                        {section.subtitle}
                      </p>
                    </div>
                    <div className={`ml-4 p-3 rounded-full bg-white/20 transition-all duration-300 ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`}>
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-700" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-700" />
                      )}
                    </div>
                  </div>
                  
                  {/* Collapsed Content */}
                  <div className={`
                    transition-all duration-500 ease-out
                    ${isExpanded ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-96'}
                  `}>
                    <div className="mt-6">
                      {section.collapsedContent}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <div className={`
                  transition-all duration-500 ease-out overflow-hidden
                  ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                `}>
                  <div className="px-8 pb-8">
                    <div className="border-t border-white/20 pt-6">
                      {section.expandedContent}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Instruction Text */}
      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm">
          Click on any section to expand and explore detailed information
        </p>
      </div>
    </div>
  );
} 