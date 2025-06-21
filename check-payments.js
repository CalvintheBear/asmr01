const { PrismaClient } = require('@prisma/client');
process.env.DATABASE_URL = 'postgresql://postgres:wGgVnAtvDEZxDmyZfMuJJLqSmteroInW@gondola.proxy.rlwy.net:10910/railway';
const db = new PrismaClient();

(async () => {
  try {
    console.log('🔍 详细检查支付状态...\n');
    
    // 检查未匹配支付
    const unmatchedPayments = await db.auditLog.findMany({
      where: { action: 'payment_user_not_found' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('❌ 未匹配支付记录:', unmatchedPayments.length);
    unmatchedPayments.forEach((log, index) => {
      console.log(`${index + 1}. 时间: ${log.createdAt}`);
      console.log('   详情:', JSON.stringify(log.details, null, 2));
      console.log('');
    });
    
    // 检查成功的支付
    const successPayments = await db.auditLog.findMany({
      where: { action: 'credits_synced_success' },
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    
    console.log('✅ 成功同步的支付:', successPayments.length);
    successPayments.forEach((log, index) => {
      console.log(`${index + 1}. 时间: ${log.createdAt}`);
      console.log('   详情:', JSON.stringify(log.details, null, 2));
      console.log('');
    });
    
    // 检查所有用户
    const users = await db.user.findMany({
      where: {
        email: { in: ['y2983236233@gmail.com', 'j2983236233@gmail.com'] }
      },
      select: { id: true, email: true, totalCredits: true, usedCredits: true }
    });
    
    console.log('👥 相关用户:');
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.totalCredits}积分 (用户ID: ${user.id})`);
    });
    
    // 检查所有购买记录
    const purchases = await db.purchase.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log('\n💳 最近的购买记录:', purchases.length);
    purchases.forEach((p, index) => {
      console.log(`${index + 1}. 订单: ${p.orderId}, 邮箱: ${p.paymentEmail}, 积分: ${p.creditsAdded}, 状态: ${p.status}`);
    });
    
    await db.$disconnect();
  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
})(); 