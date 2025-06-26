# Railway 环境变量配置清单

## 必需的环境变量（复制到Railway Variables）

### 基础配置
```
NODE_ENV=production
PORT=3000
```

### Clerk 认证（生产环境）
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuY3V0dGluZ2FzbXIub3JnJA
CLERK_SECRET_KEY=sk_live_IHF9Y65N6Q6NUtJU5FNmlges6IBrFPFwzwXwqb3Qxf
```

### 应用URL配置
```
NEXT_PUBLIC_APP_URL=https://cuttingasmr.org
NEXTAUTH_URL=https://cuttingasmr.org
```

### 数据库连接（Railway会自动提供DATABASE_URL）
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### Creem支付配置
```
CREEM_API_KEY=creem_4bO7LLLWie17BD2i7qTNNA
CREEM_WEBHOOK_SECRET=whsec_6jovyxtbgdcdNEMdH0nspT
CREEM_TEST_MODE=false
```

### VEO3 API配置
```
VEO3_API_KEY=c98268b5c693894dd721ed1d576edb
VEO3_API_BASE_URL=https://api.kie.ai
```

## Railway特定配置
```
RAILWAY_ENVIRONMENT=production
```

---

## 操作步骤：

1. 登录Railway Dashboard
2. 进入asmr01项目
3. 点击Variables标签页
4. 逐个添加上述环境变量
5. 在Settings中设置构建和启动命令
6. 重新部署

---

## 验证方法：
运行 `npm run check:railway` 来验证配置 