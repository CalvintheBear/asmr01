// 安全SEO优化工具 - 避免过度优化风险
class SafeSEOOptimizer {
  constructor() {
    // 安全的关键词密度范围
    this.safeDensityRanges = {
      primary: { min: 1.5, max: 3.5 },    // 主关键词：1.5-3.5%
      secondary: { min: 0.8, max: 2.0 },  // 次要关键词：0.8-2.0%
      longTail: { min: 0.3, max: 1.0 }    // 长尾词：0.3-1.0%
    };

    // ASMR相关关键词同义词库（避免重复使用相同词汇）
    this.synonyms = {
      'asmr': ['放松音频', 'ASMR内容', '舒缓声音', '放松视频', '治愈音效'],
      'video': ['视频', '内容', '作品', '素材', '媒体'],
      'create': ['制作', '生成', '创造', '打造', '构建'],
      'professional': ['专业', '高质量', '优质', '专业级', '商业级'],
      'generator': ['生成器', '制作工具', '创作助手', '生产工具', '制作平台']
    };

    // 自然语言变化模板
    this.naturalVariations = {
      'asmr video': [
        'ASMR视频', 'ASMR内容', 'ASMR作品', '放松视频', 
        '舒缓音频内容', 'ASMR音频视频', '治愈系视频'
      ],
      'ai asmr': [
        'AI ASMR', 'AI制作的ASMR', '人工智能ASMR', 
        'AI生成ASMR内容', '智能ASMR制作', 'AI辅助ASMR'
      ],
      'create asmr': [
        '制作ASMR', '创建ASMR', '生成ASMR', '打造ASMR',
        'ASMR制作', 'ASMR创作', '制作放松内容'
      ]
    };
  }

  // 分析关键词密度
  analyzeKeywordDensity(text) {
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    const keywordCount = {};

    // 统计关键词出现次数
    const targetKeywords = [
      'asmr', 'video', 'ai', 'create', 'professional', 
      'generator', 'content', 'youtube', 'relaxing'
    ];

    targetKeywords.forEach(keyword => {
      const count = words.filter(word => 
        word.includes(keyword) || keyword.includes(word)
      ).length;
      
      keywordCount[keyword] = {
        count: count,
        density: (count / totalWords * 100).toFixed(2) + '%'
      };
    });

    return {
      totalWords,
      keywordAnalysis: keywordCount,
      riskAssessment: this.assessSEORisk(keywordCount, totalWords)
    };
  }

  // 评估SEO风险
  assessSEORisk(keywordCount, totalWords) {
    const risks = [];
    
    Object.entries(keywordCount).forEach(([keyword, data]) => {
      const density = parseFloat(data.density);
      
      if (density > 4.0) {
        risks.push({
          type: 'high_density',
          keyword: keyword,
          density: density,
          message: `"${keyword}"密度${density}%过高，建议降至3.5%以下`,
          severity: 'high'
        });
      } else if (density > 3.5) {
        risks.push({
          type: 'moderate_density',
          keyword: keyword,
          density: density,
          message: `"${keyword}"密度${density}%偏高，建议适当减少`,
          severity: 'medium'
        });
      }
    });

    return {
      overallRisk: risks.length > 0 ? 'medium' : 'low',
      risks: risks,
      recommendations: this.generateSafeRecommendations(risks)
    };
  }

  // 生成安全优化建议
  generateSafeRecommendations(risks) {
    const recommendations = [];

    if (risks.some(r => r.severity === 'high')) {
      recommendations.push({
        priority: 'urgent',
        action: '立即使用同义词替换部分重复关键词',
        example: 'ASMR → 放松音频、舒缓声音'
      });
    }

    recommendations.push({
      priority: 'important',
      action: '增加LSI（语义相关）关键词',
      example: 'meditation, relaxation, sleep aid, stress relief'
    });

    recommendations.push({
      priority: 'suggested',
      action: '使用自然语言变化',
      example: '"创建ASMR" → "制作放松内容"'
    });

    return recommendations;
  }

  // 安全优化文本
  optimizeTextSafely(text, targetKeyword) {
    let optimizedText = text;
    const analysis = this.analyzeKeywordDensity(text);
    
    // 如果密度过高，使用同义词替换
    if (analysis.riskAssessment.overallRisk !== 'low') {
      optimizedText = this.replaceBySynonyms(optimizedText);
    }

    // 添加LSI关键词
    optimizedText = this.addLSIKeywords(optimizedText, targetKeyword);
    
    // 自然语言变化
    optimizedText = this.addNaturalVariations(optimizedText);

    return {
      originalText: text,
      optimizedText: optimizedText,
      improvements: this.getImprovementSummary(analysis, this.analyzeKeywordDensity(optimizedText))
    };
  }

  // 同义词替换
  replaceBySynonyms(text) {
    let result = text;
    
    Object.entries(this.synonyms).forEach(([original, synonymList]) => {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      const matches = result.match(regex) || [];
      
      // 如果出现次数过多，替换一部分
      if (matches.length > 3) {
        let replaceCount = 0;
        result = result.replace(regex, (match) => {
          replaceCount++;
          // 每3次出现替换1次
          if (replaceCount % 3 === 0) {
            const randomSynonym = synonymList[Math.floor(Math.random() * synonymList.length)];
            return randomSynonym;
          }
          return match;
        });
      }
    });

    return result;
  }

  // 添加LSI关键词
  addLSIKeywords(text, targetKeyword) {
    const lsiKeywords = {
      'asmr': ['放松', '冥想', '睡眠辅助', '减压', '舒缓'],
      'video': ['多媒体', '视觉内容', '音频视觉'],
      'ai': ['人工智能', '机器学习', '智能算法'],
      'generator': ['工具', '平台', '系统', '解决方案']
    };

    const relevantLSI = lsiKeywords[targetKeyword?.toLowerCase()] || [];
    
    if (relevantLSI.length > 0) {
      // 随机选择1-2个LSI关键词自然插入
      const selectedLSI = relevantLSI.slice(0, 2);
      const insertPoint = Math.floor(text.length * 0.7); // 在70%位置插入
      
      const lsiPhrase = `这些${selectedLSI.join('和')}功能`;
      return text.slice(0, insertPoint) + ` ${lsiPhrase} ` + text.slice(insertPoint);
    }

    return text;
  }

  // 自然语言变化
  addNaturalVariations(text) {
    let result = text;
    
    Object.entries(this.naturalVariations).forEach(([phrase, variations]) => {
      const regex = new RegExp(phrase, 'gi');
      const matches = result.match(regex) || [];
      
      if (matches.length > 1) {
        let useVariation = false;
        result = result.replace(regex, (match) => {
          useVariation = !useVariation;
          if (useVariation) {
            const randomVariation = variations[Math.floor(Math.random() * variations.length)];
            return randomVariation;
          }
          return match;
        });
      }
    });

    return result;
  }

  // 生成改进总结
  getImprovementSummary(beforeAnalysis, afterAnalysis) {
    return {
      densityChanges: this.compareDensities(beforeAnalysis.keywordAnalysis, afterAnalysis.keywordAnalysis),
      riskReduction: {
        before: beforeAnalysis.riskAssessment.overallRisk,
        after: afterAnalysis.riskAssessment.overallRisk
      },
      totalWords: {
        before: beforeAnalysis.totalWords,
        after: afterAnalysis.totalWords
      }
    };
  }

  compareDensities(before, after) {
    const changes = {};
    Object.keys(before).forEach(keyword => {
      const beforeDensity = parseFloat(before[keyword].density);
      const afterDensity = parseFloat(after[keyword].density);
      changes[keyword] = {
        before: beforeDensity,
        after: afterDensity,
        change: (afterDensity - beforeDensity).toFixed(2)
      };
    });
    return changes;
  }

  // 检查页面整体SEO健康度
  checkPageSEOHealth() {
    const elements = {
      title: document.querySelector('title')?.textContent || '',
      h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent).join(' '),
      h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent).join(' '),
      paragraphs: Array.from(document.querySelectorAll('p')).map(p => p.textContent).join(' ')
    };

    const fullText = Object.values(elements).join(' ');
    const analysis = this.analyzeKeywordDensity(fullText);

    return {
      textAnalysis: analysis,
      structureCheck: this.checkStructure(),
      recommendations: this.generatePageRecommendations(analysis)
    };
  }

  checkStructure() {
    return {
      hasH1: document.querySelectorAll('h1').length === 1,
      hasMultipleH2: document.querySelectorAll('h2').length >= 2,
      hasMetaDescription: !!document.querySelector('meta[name="description"]'),
      hasStructuredData: !!document.querySelector('script[type="application/ld+json"]'),
      imageAltTags: Array.from(document.querySelectorAll('img')).every(img => img.alt)
    };
  }

  generatePageRecommendations(analysis) {
    const recommendations = [];

    if (analysis.riskAssessment.overallRisk === 'high') {
      recommendations.push({
        type: 'urgent',
        message: '关键词密度过高，需要立即优化',
        action: '使用同义词替换和自然语言变化'
      });
    }

    if (analysis.totalWords < 300) {
      recommendations.push({
        type: 'content',
        message: '内容长度不足，建议增加到500+词',
        action: '添加更多有价值的信息和案例'
      });
    }

    return recommendations;
  }
}

// 自动SEO监控系统
class AutoSEOMonitor {
  constructor() {
    this.optimizer = new SafeSEOOptimizer();
    this.monitorInterval = null;
    this.alerts = [];
  }

  startMonitoring() {
    if (this.monitorInterval) return;

    this.monitorInterval = setInterval(() => {
      const health = this.optimizer.checkPageSEOHealth();
      
      if (health.textAnalysis.riskAssessment.overallRisk !== 'low') {
        this.sendAlert({
          type: 'seo_risk',
          data: health,
          timestamp: new Date().toISOString()
        });
      }
    }, 10000); // 每10秒检查一次

    console.log('🔍 SEO安全监控已启动');
  }

  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('⏹️ SEO监控已停止');
    }
  }

  sendAlert(alert) {
    this.alerts.push(alert);
    console.warn('⚠️ SEO风险警告:', alert);
    
    // 在开发环境显示警告
    if (window.location.hostname === 'localhost') {
      this.showDeveloperWarning(alert);
    }
  }

  showDeveloperWarning(alert) {
    const warningDiv = document.createElement('div');
    warningDiv.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #ff6b35;
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 10000;
      max-width: 300px;
      font-size: 12px;
    `;
    warningDiv.innerHTML = `
      <strong>SEO风险警告</strong><br>
      ${alert.data.textAnalysis.riskAssessment.risks.map(r => r.message).join('<br>')}
      <button onclick="this.parentElement.remove()" style="float: right; margin-left: 10px;">×</button>
    `;
    document.body.appendChild(warningDiv);

    // 5秒后自动移除
    setTimeout(() => {
      if (warningDiv.parentElement) {
        warningDiv.remove();
      }
    }, 5000);
  }

  getAlertHistory() {
    return this.alerts;
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  const seoOptimizer = new SafeSEOOptimizer();
  const seoMonitor = new AutoSEOMonitor();

  // 开发环境启用监控
  if (window.location.hostname === 'localhost') {
    seoMonitor.startMonitoring();
  }

  // 添加到全局对象
  window.SafeSEOOptimizer = seoOptimizer;
  window.SEOMonitor = seoMonitor;

  // 初始检查
  const healthCheck = seoOptimizer.checkPageSEOHealth();
  console.log('📊 页面SEO健康度检查:', healthCheck);
});

export { SafeSEOOptimizer, AutoSEOMonitor }; 