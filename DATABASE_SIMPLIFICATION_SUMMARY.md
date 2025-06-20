# CuttingASMR.org 数据库简化总结

## 概述
根据用户需求"积分就是积分，没有什么等级一说"，我们对项目进行了重大重构，完全移除了subscription（订阅）概念，采用纯积分购买模式。

## 核心变更

### 1. 数据库架构简化

#### 移除的表：
- `UserStats` - 用户统计表（复杂的积分管理）
- `Subscription` - 订阅管理表
- `PaymentHistory` - 旧的支付历史表

#### 新增/修改的表：

**User表（简化后）**：
```sql
model User {
  id                String   @id @default(cuid())
  clerkUserId       String   @unique
  email             String   @unique
  googleFullName    String?
  googleImageUrl    String?
  customDisplayName String?
  isActive          Boolean  @default(true)
  
  -- 积分字段 - 简单直接
  totalCredits      Int      @default(8)     // 总积分（累计购买）
  usedCredits       Int      @default(0)     // 已使用积分
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  lastLoginAt       DateTime @default(now())
}
```

**Purchase表（新增）**：
```sql
model Purchase {
  id           String   @id @default(cuid())
  userId       String
  packageType  String   // starter, standard, premium
  packageName  String   // 套餐包名称显示
  amount       Float    // 支付金额
  creditsAdded Int      // 本次购买增加的积分数量
  productId    String?  // Creem产品ID
  orderId      String?  // 订单ID
  provider     String   @default("creem")
  status       String   @default("completed")
  createdAt    DateTime @default(now())
}
```

### 2. API层面简化

#### 用户同步API (`/api/user/sync`)
- 移除UserStats表依赖
- 直接在User表管理积分
- 简化数据结构返回

#### 积分查询API (`/api/credits`)
- 直接从User表获取积分信息
- 返回简化的积分数据结构：
  ```json
  {
    "totalCredits": 123,
    "usedCredits": 45,
    "remainingCredits": 78,
    "videosCount": 4
  }
  ```

#### Webhook处理 (`/api/webhooks/creem`)
- 移除subscriptionType更新
- 直接更新User表的totalCredits字段
- 使用新的Purchase表记录购买历史
- 完全移除订阅相关逻辑

### 3. 前端组件更新

#### useCredits Hook
- 简化数据结构
- 移除复杂的嵌套数据访问
- 直接使用 `credits.remainingCredits` 而不是 `credits.credits.remaining`

#### 个人中心页面 (`/profile`)
- 完全重写，使用新的数据结构
- 移除所有subscription相关显示
- 简洁的积分信息展示

#### 其他页面
- `test-credits`, `test-payment` 等页面已更新
- 移除所有subscription相关引用

### 4. 积分包概念

现在的购买逻辑：
- **Starter积分包**: $9.9 → 115 credits
- **Standard积分包**: $30 → 355 credits  
- **Premium积分包**: $99 → 1450 credits
- **消耗**: 每个视频 = 10 credits

用户购买积分包后：
1. `totalCredits` 增加对应积分数
2. `Purchase` 表记录购买历史
3. 没有等级、没有订阅、没有复杂概念

### 5. 核心公式

```
remainingCredits = totalCredits - usedCredits
可生成视频数 = Math.floor(remainingCredits / 10)
```

## 技术改进

1. **数据一致性**: 移除了复杂的UserStats同步逻辑
2. **性能优化**: 减少了表之间的关联查询
3. **维护简便**: 积分逻辑直观易懂
4. **扩展性好**: 新增积分包只需更新配置

## 测试验证

- ✅ 数据库重置成功
- ✅ 服务器正常启动（localhost:3001）
- ✅ Health API响应正常
- ✅ Webhook逻辑已更新
- ✅ 前端页面已适配

## 总结

**之前**: 复杂的订阅系统 + UserStats表 + 多层嵌套数据结构
**现在**: 简单的积分购买 + User表直接管理 + 清晰的Purchase记录

正如用户所要求的："积分就是积分，简单明确"。现在的系统更加直观、易维护，完全符合业务需求。 