// 隐私政策内容统一管理
export const privacyPolicyContent = {
  // 基本信息
  effectiveDate: "2025年1月8日",
  contactEmail: "supportadmin@cuttingasmr.org",
  companyName: "CuttingASMR.org",
  websiteUrl: "https://cuttingasmr.org",
  
  // 中文内容
  zh: {
    title: "隐私政策",
    introduction: `
      本隐私政策描述了CuttingASMR.org（"我们"、"我们的"或"本公司"）在您使用我们的服务时如何收集、存储、使用和/或共享您的信息的政策和程序。这包括使用我们在 https://cuttingasmr.org/ 的网站（"网站"）。隐私政策还告诉您有关您的隐私权利以及法律如何保护您。
    `,
    
    dataCollection: {
      title: "收集和使用您的个人数据",
      personalData: [
        "电子邮件地址",
        "使用数据", 
        "社交媒体信息",
        "网络Cookies",
        "ASMR偏好和内容选择",
        "视频生成历史和偏好"
      ],
      
      thirdPartyServices: [
        "Google",
        "Facebook (可选)",
        "Twitter (可选)"
      ]
    },
    
    dataUsage: [
      "提供和维护我们的服务，包括监控ASMR视频生成功能的使用",
      "管理您的账户：管理您作为服务用户的注册",
      "提供个性化ASMR内容：根据您的偏好和使用模式定制视频生成",
      "向您提供新闻、特别优惠和关于其他ASMR内容、服务和功能的一般信息",
      "管理您的请求：处理和管理您向我们提出的请求",
      "其他目的：数据分析、识别使用趋势、评估和改进我们的服务"
    ],
    
    contentRestrictions: {
      title: "内容限制",
      prohibited: [
        "非法内容：促进、便利或参与非法活动的内容",
        "有害内容：煽动仇恨、暴力或歧视的内容", 
        "明确或成人内容：色情、过度暴力或不当内容",
        "知识产权侵权：侵犯他人版权、商标的内容",
        "虚假或误导性内容：故意虚假、误导或欺骗性的内容",
        "隐私侵犯：未经同意披露个人信息的内容",
        "仇恨言论：促进仇恨、歧视或敌意的内容",
        "骚扰和欺凌：以骚扰、威胁或欺凌为目的的内容",
        "自残和自杀：促进或美化自残、自杀的内容",
        "垃圾邮件和恶意软件：包含恶意软件或诈骗内容",
        "冒充：误导性冒充个人、组织或实体的内容",
        "禁止用途：用于非法赌博、传播病毒等禁止目的"
      ],
      
      aiSpecific: [
        "不得虚假陈述：不得将AI生成内容声称为您创建而不适当披露",
        "不得输入敏感数据：不得输入种族、政治观点、宗教信仰等敏感信息",
        "不得有害输出：不得生成有害、冒犯性或违反禁令的内容", 
        "适当的ASMR内容：生成内容必须适合放松和健康目的"
      ]
    },
    
    userRights: {
      title: "您的权利",
      rights: [
        "访问权：您有权了解我们收集了哪些个人数据",
        "更正权：您可以更新或更正您的个人信息",
        "删除权：您可以要求删除您的个人数据",
        "数据可携带权：您可以要求获得您数据的副本",
        "限制处理权：您可以要求限制对您数据的处理",
        "反对权：您可以反对我们处理您的个人数据"
      ]
    },
    
    optOut: {
      title: "选择退出信息使用",
      options: [
        "浏览器设置：您可以配置浏览器设置拒绝使用cookies",
        "个性化内容选择退出：联系我们选择退出个性化ASMR内容推荐",
        "账户停用：您可以随时要求停用您的账户"
      ]
    }
  },
  
  // 英文内容
  en: {
    title: "Privacy Policy",
    introduction: `
      This Privacy Policy of CuttingASMR.org ("We," "Us," or "Our") describes Our policies and procedures on how we might collect, store, use, and/or share Your information when You use our Service. This includes use of our website at https://cuttingasmr.org/ (the "Website"). The Privacy Policy also tells You about Your privacy rights and how the law protects You.
    `,
    // ... 英文版本内容
  }
}

// 获取隐私政策内容的工具函数
export function getPrivacyContent(language: 'zh' | 'en' = 'zh') {
  return {
    ...privacyPolicyContent,
    content: privacyPolicyContent[language]
  }
} 