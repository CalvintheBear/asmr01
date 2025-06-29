'use client';

import { useEffect } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
}

interface StructuredDataProps {
  type: 'homepage' | 'faq' | 'video' | 'pricing';
  faqs?: FAQItem[];
  videos?: VideoItem[];
  pageUrl?: string;
}

export default function StructuredData({ type, faqs, videos, pageUrl }: StructuredDataProps) {
  useEffect(() => {
    // 清除现有的结构化数据脚本
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-structured-data]');
    existingScripts.forEach(script => script.remove());

    const structuredDataArray: any[] = [];

    // 简化的组织信息
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CuttingASMR",
      "url": "https://cuttingasmr.org",
      "description": "AI ASMR generator with Google Veo3 technology for content creators"
    };

    structuredDataArray.push(organizationData);

    if (type === 'homepage') {
      // 简化的首页应用数据
      const webApplicationData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "CuttingASMR AI ASMR Generator",
        "url": "https://cuttingasmr.org",
        "description": "AI ASMR video generator with Google Veo3 for YouTube creators",
        "applicationCategory": "MultimediaApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };

      structuredDataArray.push(webApplicationData);
    }

    // FAQ结构化数据
    if (faqs && faqs.length > 0) {
      const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };

      structuredDataArray.push(faqData);
    }

    // 简化的视频数据（只添加前3个视频以减少数据量）
    if (videos && videos.length > 0) {
      videos.slice(0, 3).forEach(video => {
        const videoData = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": video.title,
          "description": video.description,
          "contentUrl": video.videoUrl,
          "genre": "ASMR"
        };

        structuredDataArray.push(videoData);
      });
    }

    if (type === 'pricing') {
      // 定价页面的产品/服务数据
      const serviceData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "AI ASMR Video Generation Service",
        "description": "Professional AI-powered ASMR video generation using Google Veo3 technology",
        "provider": organizationData,
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "ASMR Video Generation Plans",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Starter Pack - 115 Credits",
                "description": "Perfect for trying our AI ASMR generator"
              },
              "price": "9.90",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Standard Pack - 250 Credits",
                "description": "Best value for regular content creators"
              },
              "price": "19.90",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Premium Pack - 600 Credits",
                "description": "For professional ASMR content creators"
              },
              "price": "39.90",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          ]
        }
      };

      structuredDataArray.push(serviceData);
    }

    // 面包屑导航（如果有页面URL）
    if (pageUrl) {
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cuttingasmr.org"
          }
        ]
      };

      // 根据URL添加面包屑
      if (pageUrl.includes('/pricing')) {
        breadcrumbData.itemListElement.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Pricing",
          "item": "https://cuttingasmr.org/pricing"
        });
      } else if (pageUrl.includes('/help')) {
        breadcrumbData.itemListElement.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Help",
          "item": "https://cuttingasmr.org/help"
        });
      } else if (pageUrl.includes('/video-showcase')) {
        breadcrumbData.itemListElement.push({
          "@type": "ListItem",
          "position": 2,
          "name": "Video Showcase",
          "item": "https://cuttingasmr.org/video-showcase"
        });
      }

      if (breadcrumbData.itemListElement.length > 1) {
        structuredDataArray.push(breadcrumbData);
      }
    }

    // 添加所有结构化数据到页面
    structuredDataArray.forEach((data, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-structured-data', `true-${index}`);
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

  }, [type, faqs, videos, pageUrl]);

  return null;
} 