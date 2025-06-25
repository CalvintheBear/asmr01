// 积分系统配置 - 基于kie.ai Veo3 Fast模型
export const CREDITS_CONFIG = {
  // 核心积分配置
  INITIAL_CREDITS: 8,    // 新用户初始积分
  VIDEO_COST: 10,        // 每个视频固定消耗积分数（veo3_fast模型：8秒720p视频+音频）
  
  // 积分包配置（用于支付页面显示和积分计算）
  PLANS: {
    starter: {
      creditsToAdd: 115,   // 可生成11个veo3_fast视频
      price: 9.9
    },
    standard: {
      creditsToAdd: 355,   // 可生成35个veo3_fast视频
      price: 30
    },
    premium: {
      creditsToAdd: 1450,  // 可生成145个veo3_fast视频
      price: 99
    }
  },
  
  // 业务逻辑函数
  calculateTotalCredits: (addedCredits: number) => {
    return CREDITS_CONFIG.INITIAL_CREDITS + addedCredits
  },
  
  // 用于显示的默认值
  getDisplayCredits: (userCredits?: number | null) => {
    return userCredits ?? CREDITS_CONFIG.INITIAL_CREDITS
  },

  // 检查积分是否足够生成veo3_fast视频（8秒720p+音频）
  canCreateVideo: (currentCredits: number) => {
    return currentCredits >= CREDITS_CONFIG.VIDEO_COST
  },

  // 计算可创建的veo3_fast视频数量
  getVideoCount: (credits: number) => {
    return Math.floor(credits / CREDITS_CONFIG.VIDEO_COST)
  }
}

export default CREDITS_CONFIG 