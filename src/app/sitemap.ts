import { MetadataRoute } from 'next';
import { showcaseVideos } from '@/data/showcase-videos';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cuttingasmr.org';

  // 1. 添加静态页面
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/video-showcase`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/help`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    },
    {
        url: `${baseUrl}/perplexity-for-creators`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    },
    {
        url: `${baseUrl}/earn-money-with-perplexity-ai`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    },
    {
        url: `${baseUrl}/make-money-with-ai-asmr`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    },
    {
        url: `${baseUrl}/make-money-with-ai`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
    {
        url: `${baseUrl}/ai-vs-traditional-asmr`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    },
  ];

  // 2. 动态添加所有视频子页
  const videoRoutes: MetadataRoute.Sitemap = showcaseVideos.map((video) => ({
    url: `${baseUrl}/video-showcase/${video.id}`,
    lastModified: new Date(video.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...videoRoutes];
} 