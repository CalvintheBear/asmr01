export interface ShowcaseVideo {
  id: string;
  title: string;
  description: string;
  prompt: string;                  // 新增：用于生成视频的提示词
  thumbnailUrl: string;            // 视频缩略图
  videoUrl: string;                // 腾讯云视频链接
  duration: string;                // 例: "0:30"
  category: VideoCategory;
  asmrType: string;                // 对应的ASMR类型
  featured: boolean;               // 是否在首页展示
  createdAt: string;               // ISO日期格式
  viewCount?: number;              // 可选：观看次数
  tags: string[];                  // 标签数组
  seoTitle?: string;               // 可选：手动指定的SEO标题
  seoDescription?: string;         // 可选：手动指定的SEO描述
}

export type VideoCategory = 
  | 'crystal'         // 水晶玻璃相关
  | 'nature'          // 自然声音
  | 'texture'         // 纹理材质
  | 'satisfying';     // 解压视频

export interface VideoShowcaseProps {
  maxVideos?: number;              // 最大显示数量 (首页6个)
  showHeader?: boolean;            // 是否显示标题
  showViewMore?: boolean;          // 是否显示"查看更多"按钮
  columns?: 1 | 2 | 3;            // 网格列数
}

export interface VideoCardProps {
  video: ShowcaseVideo;
  onClick: (video: ShowcaseVideo) => void;
}

export interface VideoModalProps {
  video: ShowcaseVideo | null;
  isOpen: boolean;
  onClose: () => void;
} 