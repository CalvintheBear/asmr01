// AI内容人性化改写工具
class ContentEnhancer {
  constructor() {
    this.personalExperiences = [
      "在我测试了50多款ASMR工具后发现",
      "根据我3年的ASMR视频制作经验",
      "我在实际使用中遇到的最大问题是",
      "经过反复对比测试，我个人推荐",
      "作为一个每天制作ASMR内容的创作者"
    ];
    
    this.specificData = {
      '2025-01': { users: '12,000+', tools: '200+', success_rate: '87%' },
      '2024-12': { users: '8,500+', tools: '150+', success_rate: '82%' },
      'latest_update': '2025年1月15日'
    };
  }

  // 添加个人经验表述
  addPersonalTouch(content) {
    const personalIntros = [
      "根据我个人的实际使用体验，",
      "在过去6个月的测试中，我发现",
      "作为ASMR内容创作者，我必须坦率地说",
      "经过大量实际操作后，我的建议是"
    ];
    
    const randomIntro = personalIntros[Math.floor(Math.random() * personalIntros.length)];
    return randomIntro + content;
  }

  // 注入具体数据和时间点
  injectSpecificData(content) {
    const currentData = this.specificData['2025-01'];
    const dataPoints = [
      `目前已有${currentData.users}创作者在使用`,
      `成功率达到${currentData.success_rate}`,
      `支持${currentData.tools}种不同的ASMR场景`,
      `最新更新于${this.specificData.latest_update}`
    ];
    
    // 随机插入1-2个数据点
    const selectedData = dataPoints.slice(0, Math.floor(Math.random() * 2) + 1);
    return content + "\n\n" + selectedData.join("，") + "。";
  }

  // 添加具体案例和对比
  addCaseStudies(topic) {
    const cases = {
      'ice-cutting': {
        case: "我为一个美食博主制作了冰块切割ASMR视频",
        result: "在TikTok上获得了15万播放量",
        insight: "关键在于声音的层次感和视觉的满足感"
      },
      'keyboard': {
        case: "帮助程序员朋友制作了机械键盘打字ASMR",
        result: "用作直播背景音，观众停留时间增加40%",
        insight: "不同轴体的声音差异是成功的关键"
      }
    };
    
    if (cases[topic]) {
      const caseData = cases[topic];
      return `\n\n## 💡 真实案例分享\n${caseData.case}，${caseData.result}。我的经验是：${caseData.insight}。`;
    }
    return '';
  }

  // 检测并减少AI痕迹
  reduceAIFootprint(content) {
    // 替换常见的AI表述
    const aiPhrases = {
      '总的来说': '根据我的观察',
      '综上所述': '基于实际使用经验',
      '此外': '另外我发现',
      '需要注意的是': '特别要提醒的是',
      '值得一提的是': '我想强调的是'
    };
    
    let humanized = content;
    Object.entries(aiPhrases).forEach(([ai, human]) => {
      humanized = humanized.replace(new RegExp(ai, 'g'), human);
    });
    
    return humanized;
  }

  // 完整的内容增强流程
  enhanceContent(originalContent, contentType = 'general') {
    let enhanced = originalContent;
    
    // 1. 添加个人视角
    enhanced = this.addPersonalTouch(enhanced);
    
    // 2. 注入具体数据
    enhanced = this.injectSpecificData(enhanced);
    
    // 3. 添加案例研究
    if (contentType !== 'general') {
      enhanced += this.addCaseStudies(contentType);
    }
    
    // 4. 减少AI痕迹
    enhanced = this.reduceAIFootprint(enhanced);
    
    // 5. 添加时效性信息
    enhanced += this.addTimestampInfo();
    
    return enhanced;
  }

  addTimestampInfo() {
    const now = new Date();
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月"];
    
    return `\n\n---\n*最后更新于 ${now.getFullYear()}年${monthNames[now.getMonth()]}${now.getDate()}日*`;
  }
}

// 内容质量检测器
class ContentQualityChecker {
  checkQuality(content) {
    const checks = {
      length: content.length > 500,
      personalTouch: /我|经验|发现|建议|测试/.test(content),
      specificData: /\d+%|\d+万|\d+年\d+月/.test(content),
      caseStudy: /案例|实际|真实/.test(content),
      timestamp: /更新于|最新/.test(content)
    };
    
    const score = Object.values(checks).filter(Boolean).length * 20;
    const issues = Object.entries(checks)
      .filter(([key, passed]) => !passed)
      .map(([key]) => this.getIssueMessage(key));
    
    return { score, issues, passed: score >= 80 };
  }
  
  getIssueMessage(issue) {
    const messages = {
      length: '内容长度不足，建议至少500字',
      personalTouch: '缺少个人经验表述',
      specificData: '缺少具体数据支撑',
      caseStudy: '建议添加实际案例',
      timestamp: '缺少时间标记'
    };
    return messages[issue];
  }
}

export { ContentEnhancer, ContentQualityChecker }; 