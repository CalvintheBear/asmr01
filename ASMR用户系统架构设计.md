# ASMR视频生成应用 - 用户系统架构设计文档

## 项目概述

本文档详细描述了ASMR视频生成应用的用户系统架构设计，重点解决如何在提供完整用户体验的同时，最小化数据存储负担和维护成本。

## 核心设计目标

- **最小化数据存储**：只存储必要的用户和业务数据
- **轻量化架构**：利用外部服务减少自身负担  
- **用户体验优先**：简化登录和使用流程
- **成本控制**：减少存储和维护成本

## 数据库设计（极简版）

### 核心数据表

```sql
-- 用户表：存储Google OAuth用户信息
users (
  id, 
  google_id, 
  email, 
  name, 
  avatar_url,
  created_at,
  updated_at
)

-- 积分表：管理积分和试用次数
user_credits (
  id,
  user_id,
  total_credits,
  used_credits,
  trial_used,
  created_at,
  updated_at
)

-- 支付表：记录Stripe支付信息
payments (
  id,
  user_id,
  stripe_payment_id,
  amount,
  credits_purchased,
  status,
  created_at
)

-- 订阅表：管理订阅状态（可选）
subscriptions (
  id,
  user_id,
  stripe_subscription_id,
  plan_type,
  status,
  current_period_start,
  current_period_end
)
```

## 视频历史记录解决方案

### 方案1：本地存储 + 轻量云端同步（推荐）

```javascript
// 本地存储视频ID，通过API实时获取详情
const saveVideoToHistory = (videoId, title) => {
  const history = JSON.parse(localStorage.getItem('asmr_history') || '[]');
  history.unshift({ id: videoId, title, timestamp: Date.now() });
  localStorage.setItem('asmr_history', JSON.stringify(history.slice(0, 50)));
};

// 获取历史记录详情
const getVideoHistory = async () => {
  const localHistory = JSON.parse(localStorage.getItem('asmr_history') || '[]');
  const videoDetails = await Promise.all(
    localHistory.map(item => fetchVideoDetails(item.id))
  );
  return videoDetails;
};
```

### 方案2：第三方存储（Firebase/Supabase）

```javascript
// 使用外部服务存储历史记录，减少主数据库负担
import { supabase } from '@/lib/supabase';

const saveVideoHistory = async (userId, videoData) => {
  await supabase
    .from('user_video_history')
    .insert({ user_id: userId, video_id: videoData.id, ...videoData });
};
```

## 身份认证系统

### Google OAuth集成

```javascript
// NextAuth配置
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      // 自动将用户信息存储到数据库
      await saveUserToDatabase(user, account);
      return true;
    }
  }
};
```

### Google Cloud Console 设置步骤

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API 和 Google OAuth2 API
4. 创建OAuth 2.0客户端ID凭据
5. 配置授权重定向URI

## 支付系统设计

### Stripe集成

```javascript
// 积分购买包设置
const creditPackages = {
  'starter': { 
    credits: 100, 
    price: 999,  // $9.99 (以分为单位)
    description: '入门包 - 100积分'
  },
  'pro': { 
    credits: 300, 
    price: 2499, // $24.99
    description: '专业包 - 300积分'
  },
  'premium': { 
    credits: 600, 
    price: 3999, // $39.99
    description: '高级包 - 600积分'
  }
};

// 创建支付会话
const createCheckoutSession = async (packageType, userId) => {
  const package = creditPackages[packageType];
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: package.description },
        unit_amount: package.price,
      },
      quantity: 1,
    }],
    metadata: { userId, packageType, credits: package.credits },
    success_url: `${process.env.DOMAIN}/payment/success`,
    cancel_url: `${process.env.DOMAIN}/payment/cancel`,
  });
  
  return session;
};
```

## 架构优势

### 成本优化
- ✅ **成本降低90%** - 不存储视频元数据和文件
- ✅ **存储精简** - 只有4张核心数据表
- ✅ **带宽节省** - 视频通过第三方API直接获取

### 性能优化  
- ✅ **查询速度快** - 数据库负载小
- ✅ **响应迅速** - 本地存储历史记录
- ✅ **可扩展性强** - 易于水平扩展

### 用户体验
- ✅ **一键登录** - Google OAuth无缝集成
- ✅ **即时历史** - 本地存储快速访问
- ✅ **安全支付** - Stripe专业支付处理

## 实施计划

### 阶段1：基础用户系统（1周）
- [ ] Google OAuth 集成
- [ ] 用户数据表设计和创建
- [ ] 积分系统基础逻辑
- [ ] 登录注册界面

### 阶段2：支付系统（1-2周）
- [ ] Stripe 支付集成
- [ ] 积分购买流程
- [ ] Webhook 事件处理
- [ ] 支付成功/失败处理

### 阶段3：历史记录系统（3-5天）
- [ ] 本地存储管理器
- [ ] 历史记录查看界面
- [ ] 可选的云端同步功能
- [ ] 导出/导入功能

### 阶段4：高级功能（可选）
- [ ] 月度订阅系统
- [ ] 用户仪表板
- [ ] 邀请奖励机制
- [ ] 使用统计分析

## 核心理念

**"最小化存储，最大化体验"**

这个架构设计的核心理念是通过智能的数据管理策略，在提供完整用户体验的同时，最大程度减少系统负担：

- **只存储必需数据** - 用户信息、积分、支付记录
- **历史记录外置** - 本地存储 + API实时查询  
- **第三方服务** - 充分利用Google、Stripe等专业服务
- **专注核心功能** - 将资源集中在视频生成功能上

## 技术栈建议

- **前端框架**：Next.js 14+ (App Router)
- **身份认证**：NextAuth.js
- **数据库**：PostgreSQL + Prisma ORM
- **支付处理**：Stripe
- **部署平台**：Vercel / Railway
- **监控日志**：Vercel Analytics + Sentry