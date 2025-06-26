'use client'

import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  canonical?: string
  keywords?: string
  ogImage?: string
  ogType?: string
}

export default function SEOHead({ 
  title, 
  description, 
  canonical, 
  keywords,
  ogImage = '/logo.svg',
  ogType = 'website'
}: SEOHeadProps) {
  useEffect(() => {
    // 设置页面标题
    document.title = title
    
    // 设置meta描述
    updateMetaTag('name', 'description', description)
    
    // 设置关键词
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords)
    }
    
    // 设置canonical URL
    if (canonical) {
      updateLinkTag('rel', 'canonical', 'href', canonical)
    }
    
    // 设置Open Graph标签
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:type', ogType)
    updateMetaTag('property', 'og:image', ogImage)
    updateMetaTag('property', 'og:site_name', 'CuttingASMR.org')
    
    if (canonical) {
      updateMetaTag('property', 'og:url', canonical)
    }
    
    // 设置Twitter Card标签
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', title)
    updateMetaTag('name', 'twitter:description', description)
    updateMetaTag('name', 'twitter:image', ogImage)
    
  }, [title, description, canonical, keywords, ogImage, ogType])
  
  return null
}

// 辅助函数：更新或创建meta标签
function updateMetaTag(attribute: string, value: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, value)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

// 辅助函数：更新或创建link标签
function updateLinkTag(attribute: string, value: string, hrefAttribute: string, href: string) {
  let link = document.querySelector(`link[${attribute}="${value}"]`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute(attribute, value)
    document.head.appendChild(link)
  }
  link.setAttribute(hrefAttribute, href)
} 