import { ShowcaseVideo, VideoCategory } from './video-types';

// 示例数据 - 后续替换为真实的腾讯云链接
export const showcaseVideos: ShowcaseVideo[] = [
  {
    id: 'squeeze-toy-1',
    title: 'Squeeze Toy ASMR',
    description: 'Satisfying squeeze toy sounds with soft textures and gentle pressure effects.',
    thumbnailUrl: 'https://via.placeholder.com/400x300/fbbf24/f59e0b?text=Squeeze+Toy',
    videoUrl: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/%E6%8D%8F%E6%8D%8F%E4%B9%90.mp4',
    duration: '0:52',
    category: 'texture',
    asmrType: 'Squeeze Toy',
    featured: true,
    createdAt: '2024-12-26T14:00:00Z',
    viewCount: 1456,
    tags: ['squeeze', 'texture', 'soft']
  },
  {
    id: 'digital-product-cutting-1',
    title: 'Digital Product Cutting ASMR',
    description: 'Precise cutting sounds of digital devices with crisp electronic textures.',
    thumbnailUrl: 'https://via.placeholder.com/400x300/3b82f6/1d4ed8?text=Digital+Cut',
    videoUrl: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E6%95%B0%E7%A0%81%E4%BA%A7%E5%93%81.mp4',
    duration: '1:08',
    category: 'satisfying',
    asmrType: 'Digital Cutting',
    featured: true,
    createdAt: '2024-12-26T13:30:00Z',
    viewCount: 2134,
    tags: ['digital', 'cutting', 'electronic']
  },
  {
    id: 'glass-fruit-cutting-1',
    title: 'Glass Fruit Cutting ASMR',
    description: 'Beautiful glass fruit cutting with crystalline sounds and satisfying visual effects.',
    thumbnailUrl: 'https://via.placeholder.com/400x300/06b6d4/0891b2?text=Glass+Fruit',
    videoUrl: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%88%87%E5%89%B2%E7%8E%BB%E7%92%83%E6%B0%B4%E6%9E%9C.mp4',
    duration: '0:58',
    category: 'crystal',
    asmrType: 'Glass Cutting',
    featured: true,
    createdAt: '2024-12-26T12:45:00Z',
    viewCount: 1789,
    tags: ['glass', 'fruit', 'crystal', 'cutting']
  },
  {
    id: 'gorilla-stone-cutting-1',
    title: 'Gorilla Stone Cutting ASMR',
    description: 'Unique stone cutting experience with natural textures and primal satisfaction.',
    thumbnailUrl: 'https://via.placeholder.com/400x300/84cc16/65a30d?text=Stone+Cut',
    videoUrl: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/%E7%8C%A9%E7%8C%A9%E5%88%87%E7%9F%B3%E5%A4%B4.mp4',
    duration: '1:15',
    category: 'nature',
    asmrType: 'Stone Cutting',
    featured: true,
    createdAt: '2024-12-26T11:20:00Z',
    viewCount: 1623,
    tags: ['stone', 'nature', 'gorilla', 'cutting']
  },
  {
    id: 'bread-golden-sauce-1',
    title: 'Bread with Golden Sauce ASMR',
    description: 'Satisfying bread spreading with rich golden sauce and smooth textures.',
    thumbnailUrl: 'https://via.placeholder.com/400x300/fbbf24/d97706?text=Golden+Sauce',
    videoUrl: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/%E9%9D%A2%E5%8C%85%E6%B6%82%E6%8A%B9%E9%BB%84%E9%87%91%E9%85%B1.mp4',
    duration: '1:02',
    category: 'texture',
    asmrType: 'Food Texture',
    featured: true,
    createdAt: '2024-12-26T10:30:00Z',
    viewCount: 2456,
    tags: ['bread', 'sauce', 'food', 'texture']
  },
  {
    id: 'mc-block-cutting-1',
    title: 'Minecraft Block Cutting ASMR',
    description: 'Satisfying Minecraft block cutting with perfect geometric precision and crisp sound effects.',
    thumbnailUrl: 'https://via.placeholder.com/400x300/4ade80/16a34a?text=MC+Block+Cut',
    videoUrl: 'https://aiasmr-video-1363880159.cos.ap-guangzhou.myqcloud.com/%E5%88%87mc%E6%96%B9%E5%9D%97.mp4',
    duration: '0:45',
    category: 'satisfying',
    asmrType: 'Block Cutting',
    featured: true,
    createdAt: '2024-12-26T15:30:00Z',
    viewCount: 1856,
    tags: ['minecraft', 'cutting', 'satisfying', 'blocks']
  }
];

// 获取首页展示的视频（featured=true的前6个）
export const getFeaturedVideos = (limit: number = 6): ShowcaseVideo[] => {
  return showcaseVideos
    .filter(video => video.featured)
    .slice(0, limit);
};

// 根据分类获取视频
export const getVideosByCategory = (category: VideoCategory): ShowcaseVideo[] => {
  return showcaseVideos.filter(video => video.category === category);
};

// 获取最新视频
export const getLatestVideos = (limit: number = 6): ShowcaseVideo[] => {
  return showcaseVideos
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}; 