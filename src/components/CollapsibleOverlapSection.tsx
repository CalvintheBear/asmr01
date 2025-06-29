'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // 最小滑动距离（像素）
  const minSwipeDistance = 50;

  // 自动轮播和进度条
  useEffect(() => {
    if (!isAutoPlay) {
      setProgress(0);
      return;
    }
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % sections.length);
          return 0;
        }
        return prev + (100 / 40); // 4秒 = 4000ms，每100ms增加2.5%
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isAutoPlay, sections.length, currentIndex]);

  // 触摸事件处理
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    setIsAutoPlay(false); // 手动点击后停止自动播放
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sections.length);
    setProgress(0);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sections.length) % sections.length);
    setProgress(0);
    setIsAutoPlay(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      {/* SEO友好的隐藏文本内容 - 所有轮播内容以静态文本形式存在 */}
      <div className="sr-only" aria-hidden="true">
        {sections.map((section) => (
          <div key={`seo-${section.id}`}>
            <h3>{section.title}</h3>
            <p>{section.subtitle}</p>
            <div>{section.collapsedContent}</div>
            <div>{section.expandedContent}</div>
          </div>
        ))}
      </div>
      
      {/* 轮播容器 */}
      <div className="relative">
        {/* 卡片轮播区域 */}
        <div 
          className="overflow-hidden rounded-3xl"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="w-full flex-shrink-0"
                // 确保内容对搜索引擎可见，即使视觉上不在视口中
                style={{ 
                  visibility: 'visible', 
                  opacity: index === currentIndex ? 1 : 0.8,
                  pointerEvents: index === currentIndex ? 'auto' : 'none'
                }}
              >
                <div className={`
                  ${section.bgGradient} 
                  rounded-3xl shadow-xl border-2 overflow-hidden backdrop-blur-sm
                  transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]
                  border-gray-200
                `}>
                  {/* 卡片内容 - 同时显示折叠和展开内容 */}
                  <article className="p-4 md:p-8">
                    <header className="mb-6 md:mb-8">
                      <h2 className={`text-xl md:text-3xl font-semibold ${section.titleColor} mb-3 md:mb-4`}>
                        {section.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-4 md:mb-6">
                        {section.subtitle}
                      </p>
                      
                      {/* 显示折叠内容 */}
                      <section className="mb-6 md:mb-8">
                        {section.collapsedContent}
                      </section>
                    </header>

                    {/* 显示展开内容 */}
                    <section className="border-t border-white/20 pt-6 md:pt-8">
                      {section.expandedContent}
                    </section>
                  </article>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 导航箭头 - 桌面端 */}
        <button
          onClick={prevSlide}
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-10 
                     bg-white/90 hover:bg-white rounded-full p-3 shadow-lg
                     transition-all duration-300 hover:scale-110"
          aria-label="上一张卡片"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-10 
                     bg-white/90 hover:bg-white rounded-full p-3 shadow-lg
                     transition-all duration-300 hover:scale-110"
          aria-label="下一张卡片"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* 移动端导航按钮 */}
      <div className="md:hidden flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={prevSlide}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 shadow-lg
                     transition-all duration-300 hover:scale-110"
          aria-label="上一张卡片"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex space-x-2">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-emerald-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`切换到第${index + 1}张卡片`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 shadow-lg
                     transition-all duration-300 hover:scale-110"
          aria-label="下一张卡片"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 自动播放进度条 */}
      {isAutoPlay && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-emerald-600 h-1 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 桌面端指示器点点 */}
      <div className="hidden md:flex justify-center mt-6 space-x-2">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-emerald-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`切换到第${index + 1}张卡片`}
          />
        ))}
      </div>

      {/* 用户提示 */}
      <div className="text-center mt-6">
        <p className="text-xs text-gray-400 md:hidden">
          👆 滑动切换卡片
        </p>
      </div>
    </div>
  );
} 