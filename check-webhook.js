const { PrismaClient } = require('@prisma/client');

process.env.DATABASE_URL = 'prisma://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway';
const db = new PrismaClient();

(async () => {
  try {
    console.log('🔍 检查webhook调用记录...');
    
    const webhookLogs = await db.auditLog.findMany({
      where: { action: 'webhook_received' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('📋 最近的webhook日志:', webhookLogs.length);
    webhookLogs.forEach(log => {
      console.log('- 时间:', log.createdAt);
      console.log('- 详情:', JSON.stringify(log.details, null, 2));
    });
    
    // 检查purchase表
    const purchases = await db.purchase.findMany({
      where: { userId: 'cmc4v0c800000fas8qi01y320' },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\n💳 用户购买记录:', purchases.length);
    purchases.forEach(p => {
      console.log('- 订单:', p.orderId, '套餐:', p.packageType, '积分:', p.creditsAdded);
    });
    
    // 检查用户当前积分
    const user = await db.user.findUnique({
      where: { id: 'cmc4v0c800000fas8qi01y320' },
      select: { email: true, totalCredits: true, usedCredits: true }
    });
    
    console.log('\n👤 当前用户状态:');
    console.log('- 邮箱:', user.email);
    console.log('- 总积分:', user.totalCredits);
    console.log('- 已使用:', user.usedCredits);
    console.log('- 剩余:', user.totalCredits - user.usedCredits);
    
    await db.$disconnect();
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
})(); 