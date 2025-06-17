// SEO内容检测工具 - 防AI检测专用
class SEOContentChecker {
  constructor() {
    this.aiIndicators = {
      // 常见AI生成内容特征
      aiPhrases: [
        '总的来说', '综上所述', '值得一提的是', '需要注意的是',
        '此外', '另外', '首先', '其次', '最后', '总结',
        '在当今社会', '随着技术的发展', '毫无疑问'
      ],
      
      // 过度使用的连接词
      overusedConnectors: [
        '然而', '因此', '所以', '由于', '鉴于',
        '基于以上', '考虑到', '换句话说'
      ],
      
      // 缺乏具体性的表述
      vagueExpressions: [
        '很多', '大量', '众多', '各种各样', '非常重要',
        '极其', '非常', '相当', '比较', '相对来说'
      ]
    };
    
    this.humanIndicators = {
      // 个人经验标识
      personalExperience: [
        '我', '我的', '我们', '我发现', '我认为', '我建议',
        '根据我的经验', '在我看来', '我个人', '我曾经'
      ],
      
      // 具体数据标识
      specificData: [
        /\d+%/, /\d+万/, /\d+个/, /\d+年/, /\d+月/, /\d+日/,
        /\d+小时/, /\d+分钟/, /\d+秒/, /\d+次/, /\d+位/
      ],
      
      // 时间标识
      timeIndicators: [
        '2025年', '2024年', '最近', '昨天', '今天', '明天',
        '上个月', '这个月', '下个月', '去年', '今年'
      ]
    };
  }

  // 检测AI生成内容的可能性
  detectAIContent(text) {
    const aiScore = this.calculateAIScore(text);
    const humanScore = this.calculateHumanScore(text);
    
    return {
      aiProbability: aiScore,
      humanProbability: humanScore,
      overallScore: humanScore - aiScore,
      recommendations: this.generateRecommendations(text, aiScore, humanScore)
    };
  }

  calculateAIScore(text) {
    let score = 0;
    const wordCount = text.split(' ').length;
    
    // 检测AI常用短语
    this.aiIndicators.aiPhrases.forEach(phrase => {
      const matches = (text.match(new RegExp(phrase, 'g')) || []).length;
      score += matches * 10;
    });
    
    // 检测过度使用的连接词
    this.aiIndicators.overusedConnectors.forEach(connector => {
      const matches = (text.match(new RegExp(connector, 'g')) || []).length;
      score += matches * 5;
    });
    
    // 检测模糊表述
    this.aiIndicators.vagueExpressions.forEach(expression => {
      const matches = (text.match(new RegExp(expression, 'g')) || []).length;
      score += matches * 3;
    });
    
    // 句子长度分析（AI倾向于生成过长的句子）
    const sentences = text.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    if (avgSentenceLength > 50) {
      score += 15;
    }
    
    return Math.min(score / wordCount * 100, 100);
  }

  calculateHumanScore(text) {
    let score = 0;
    const wordCount = text.split(' ').length;
    
    // 检测个人经验表述
    this.humanIndicators.personalExperience.forEach(indicator => {
      const matches = (text.match(new RegExp(indicator, 'g')) || []).length;
      score += matches * 15;
    });
    
    // 检测具体数据
    this.humanIndicators.specificData.forEach(pattern => {
      const matches = (text.match(pattern) || []).length;
      score += matches * 10;
    });
    
    // 检测时间标识
    this.humanIndicators.timeIndicators.forEach(indicator => {
      if (text.includes(indicator)) {
        score += 8;
      }
    });
    
    // 检测问号（人类更倾向于使用疑问句）
    const questionMarks = (text.match(/[？?]/g) || []).length;
    score += questionMarks * 5;
    
    // 检测感叹号（表达情感）
    const exclamationMarks = (text.match(/[！!]/g) || []).length;
    score += exclamationMarks * 3;
    
    return Math.min(score / wordCount * 100, 100);
  }

  generateRecommendations(text, aiScore, humanScore) {
    const recommendations = [];
    
    if (aiScore > 30) {
      recommendations.push({
        type: 'warning',
        message: 'AI特征过于明显，建议增加个人经验描述',
        action: '添加"我发现"、"根据我的经验"等个人化表述'
      });
    }
    
    if (humanScore < 20) {
      recommendations.push({
        type: 'error',
        message: '缺乏人性化元素，存在被AI检测的风险',
        action: '增加具体数据、时间标记和个人观点'
      });
    }
    
    if (!text.match(/\d+/)) {
      recommendations.push({
        type: 'suggestion',
        message: '建议添加具体数据支撑',
        action: '加入百分比、具体数量或时间数据'
      });
    }
    
    if (!text.includes('我') && !text.includes('我的')) {
      recommendations.push({
        type: 'suggestion',
        message: '建议增加第一人称表述',
        action: '使用"我认为"、"我的经验是"等表达方式'
      });
    }
    
    return recommendations;
  }

  // 批量检测页面内容
  checkPageContent() {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
    const results = [];
    
    textElements.forEach((element, index) => {
      const text = element.textContent.trim();
      if (text.length > 50) { // 只检测较长的文本
        const result = this.detectAIContent(text);
        if (result.aiProbability > 25 || result.humanProbability < 15) {
          results.push({
            element: element,
            text: text.substring(0, 100) + '...',
            ...result
          });
        }
      }
    });
    
    return results;
  }

  // 生成SEO友好的内容建议
  generateSEOContent(originalText, targetKeyword) {
    const suggestions = {
      title_suggestions: [
        `${targetKeyword}：我3年实战经验总结`,
        `专家分享：${targetKeyword}的正确使用方法`,
        `${targetKeyword}实测报告（2025年最新）`,
        `从零到专家：${targetKeyword}完整指南`
      ],
      
      content_templates: {
        intro: `作为${targetKeyword}领域的从业者，我在过去3年中积累了丰富的实战经验。`,
        experience: `根据我服务18,000+用户的经验，我发现${targetKeyword}的关键在于...`,
        data: `经过大量测试，我的${targetKeyword}成功率达到89%。`,
        conclusion: `基于以上实际操作经验，我建议...`
      },
      
      meta_description: `${targetKeyword}专家分享3年实战经验，成功率89%，已帮助18,000+用户。包含详细操作步骤和真实案例分析。`
    };
    
    return suggestions;
  }
}

// 实时内容监控器
class ContentMonitor {
  constructor() {
    this.checker = new SEOContentChecker();
    this.monitoringInterval = null;
  }

  startMonitoring() {
    if (this.monitoringInterval) return;
    
    this.monitoringInterval = setInterval(() => {
      const results = this.checker.checkPageContent();
      if (results.length > 0) {
        console.warn('发现可能的AI内容特征：', results);
        this.highlightProblematicContent(results);
      }
    }, 5000);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  highlightProblematicContent(results) {
    results.forEach(result => {
      if (result.element) {
        result.element.style.border = '2px solid orange';
        result.element.setAttribute('title', 
          `AI概率: ${result.aiProbability.toFixed(1)}% | 人性化程度: ${result.humanProbability.toFixed(1)}%`
        );
      }
    });
  }
}

// 网页加载完成后自动检测
document.addEventListener('DOMContentLoaded', function() {
  const seoChecker = new SEOContentChecker();
  const monitor = new ContentMonitor();
  
  // 开发环境下启用监控
  if (window.location.hostname === 'localhost') {
    monitor.startMonitoring();
    console.log('SEO内容监控已启动');
  }
  
  // 添加到全局对象供调试使用
  window.SEOChecker = seoChecker;
  window.ContentMonitor = monitor;
});

export { SEOContentChecker, ContentMonitor }; 