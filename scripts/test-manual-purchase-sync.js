// scripts/test-manual-purchase-sync.js

// 引入必要的模块
const { PrismaClient } = require('@prisma/client');
// 注意：我们需要能够从项目根目录正确地解析路径
const path = require('path');
const { CREEM_CONFIG } = require(path.resolve(__dirname, '../src/lib/creem-config'));

// 初始化Prisma客户端
const db = new PrismaClient();

// 目标用户ID
const USER_IDS = [
  'cmc8tknar000go60fxpiei8pv',
  'cmcdnuhfs0003nt0foes8kg09'
];

// Webhook端点URL - 默认指向本地开发服务器
const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/creem';

/**
 * 生成一个唯一的订单ID，以避免重复处理
 * @returns {string}
 */
function generateOrderId() {
  return `test_order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 模拟Creem发送的 'checkout.completed' Webhook
 * @param {object} user - 包含id和email的用户对象
 * @param {object} productInfo - 包含产品信息的对象
 * @returns {Promise<void>}
 */
async function simulateWebhookForUser(user, productInfo) {
  const orderId = generateOrderId();
  
  console.log(`\n--- [START] 模拟用户 ${user.email} 的购买 ---`);
  console.log(`- 用户ID: ${user.id}`);
  console.log(`- 订单ID: ${orderId}`);
  console.log(`- 产品: ${productInfo.planType} (${productInfo.creditsToAdd} 积分)`);

  // 构建模拟的Webhook负载
  const payload = {
    eventType: 'checkout.completed',
    object: {
      order: {
        id: orderId,
        product: productInfo.productId, // 🔥 修复：确保传递productId
        amount: productInfo.amount * 100, // 金额（分）
        currency: 'USD'
      },
      customer: {
        id: `cus_${Math.random().toString(36).substring(2, 9)}`,
        email: user.email
      }
    }
  };

  try {
    console.log(`- 正在向 ${WEBHOOK_URL} 发送POST请求...`);
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 在开发环境中，我们的webhook处理程序会跳过签名验证
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(`- [✅ SUCCESS] Webhook处理成功!`);
      console.log(`  - 消息: ${result.message}`);
      console.log(`  - 新增积分: ${result.creditsAdded}`);
    } else {
      console.error(`- [❌ FAILED] Webhook处理失败:`);
      console.error(`  - 状态码: ${response.status}`);
      console.error(`  - 错误信息: ${result.error || JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error(`- [❌ CRITICAL] 发送请求时发生严重错误:`, error);
  }
  console.log(`--- [END] 用户 ${user.email} 的模拟结束 ---\n`);
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始执行手动购买同步测试脚本...');

  // 🔥 修复：直接从配置中选择要测试的产品包
  // 1. 获取当前环境（测试/生产）下的所有产品ID
  const currentProductIds = CREEM_CONFIG.PRODUCT_IDS;
  
  // 2. 选择我们要测试的 'standard' 套餐的ID
  const standardProductId = currentProductIds.standard;
  if (!standardProductId) {
    console.error('❌ 无法在CREEM_CONFIG中为当前环境找到 "standard" 产品包的ID。');
    return;
  }
  
  // 3. 使用该ID从映射中获取完整的套餐信息
  const productInfo = CREEM_CONFIG.getProductInfo(standardProductId);
  if (!productInfo) {
    console.error(`❌ 使用ID "${standardProductId}" 无法在PRODUCT_MAPPING中找到产品信息。`);
    return;
  }
  
  // 🔥 修复：将productId添加到要测试的对象中
  const productToTest = {
    ...productInfo,
    productId: standardProductId
  };

  for (const userId of USER_IDS) {
    try {
      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        await simulateWebhookForUser(user, productToTest);
      } else {
        console.error(`\n--- [❌ NOT FOUND] 未找到用户ID: ${userId} ---\n`);
      }
    } catch (error) {
      console.error(`在处理用户 ${userId} 时发生错误:`, error);
    }
  }

  console.log('🏁 测试脚本执行完毕。');
}

// 执行主函数并断开数据库连接
main()
  .catch((e) => {
    console.error('脚本执行过程中出现未捕获的错误:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  }); 