/**
 * Vertos Dashboard 自动注册脚本（简化版）
 * 无需验证码，只需随机生成 Gmail 邮箱即可
 */

const { chromium } = require('playwright');
const fs = require('fs');

// 配置
const CONFIG = {
  baseUrl: 'https://dash.vertos.in/register',
  refCode: 'DzE8Hs1b',
  headless: true,
  screenshotsDir: 'screenshots',
  timeout: 30000,
};

// 随机数据生成器
class RandomGenerator {
  // 生成随机 Gmail 邮箱
  static gmail() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let prefix = '';
    for (let i = 0; i < 10; i++) {
      prefix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}@gmail.com`;
  }

  // 生成随机用户名
  static username() {
    const adjectives = ['Happy', 'Cool', 'Smart', 'Fast', 'Bright', 'Swift', 'Sharp', 'Clever', 'Quick', 'Bold'];
    const nouns = ['Fox', 'Dog', 'Cat', 'Bird', 'Lion', 'Tiger', 'Eagle', 'Wolf', 'Bear', 'Hawk'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `${adj}${noun}${num}`;
  }

  // 生成强密码
  static password(length = 12) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%&*';
    
    let password = '';
    // 至少一个各类字符
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // 填充剩余字符
    const all = upper + lower + digits + special;
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    // 打乱顺序
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // 随机延迟
  static delay(min = 1000, max = 3000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// 注册器
class Registrar {
  constructor() {
    this.browser = null;
    this.results = [];
  }

  async init() {
    // 创建截图目录
    if (!fs.existsSync(CONFIG.screenshotsDir)) {
      fs.mkdirSync(CONFIG.screenshotsDir, { recursive: true });
    }

    console.log('🚀 启动浏览器...');
    
    this.browser = await chromium.launch({
      headless: CONFIG.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    console.log('  ✓ 浏览器已启动\n');
  }

  async checkIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'N/A';
    }
  }

  async register(index, total) {
    const context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    
    // 生成测试数据
    const email = RandomGenerator.gmail();
    const username = RandomGenerator.username();
    const password = RandomGenerator.password();
    
    console.log(`\n[${index}/${total}] 开始注册`);
    console.log(`  📧 邮箱: ${email}`);
    console.log(`  👤 用户名: ${username}`);
    console.log(`  🔑 密码: ${password}`);

    const result = {
      index,
      email,
      username,
      password,
      timestamp: new Date().toISOString(),
      status: 'unknown',
      message: '',
    };

    try {
      // 检查 IP
      result.ip = await this.checkIP();
      console.log(`  🌐 IP: ${result.ip}`);

      // 访问注册页面
      const url = `${CONFIG.baseUrl}?ref=${CONFIG.refCode}`;
      console.log(`  → 正在访问...`);
      
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: CONFIG.timeout,
      });

      await this.sleep(RandomGenerator.delay(1500, 2500));

      // 截图：页面加载
      await page.screenshot({
        path: `${CONFIG.screenshotsDir}/${index}_01_loaded.png`,
      });

      // 填写表单
      console.log(`  → 填写表单...`);

      // 用户名字段
      await this.tryFillField(page, [
        'input[name="username"]',
        'input[name="name"]',
        'input[id="username"]',
        'input[id="name"]',
        'input[type="text"]',
      ], username);

      // 邮箱字段
      await this.tryFillField(page, [
        'input[name="email"]',
        'input[type="email"]',
        'input[id="email"]',
      ], email);

      // 密码字段
      await this.tryFillField(page, [
        'input[name="password"]',
        'input[type="password"]',
        'input[id="password"]',
      ], password);

      await this.sleep(RandomGenerator.delay(800, 1500));

      // 截图：填写完成
      await page.screenshot({
        path: `${CONFIG.screenshotsDir}/${index}_02_filled.png`,
      });

      // 提交表单
      console.log(`  → 提交注册...`);
      
      let submitted = false;
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Register")',
        'button:has-text("注册")',
        'button:has-text("Sign Up")',
        '.btn-primary',
        '.btn',
      ];

      for (const selector of submitSelectors) {
        try {
          const button = await page.$(selector);
          if (button && await button.isVisible()) {
            await button.click();
            submitted = true;
            console.log(`    ✓ 已点击按钮`);
            break;
          }
        } catch (e) {}
      }

      if (!submitted) {
        await page.keyboard.press('Enter');
        console.log(`    ✓ 已按 Enter 提交`);
      }

      // 等待响应
      await this.sleep(RandomGenerator.delay(3000, 5000));

      // 截图：提交后
      await page.screenshot({
        path: `${CONFIG.screenshotsDir}/${index}_03_submitted.png`,
      });

      // 检查结果
      const currentUrl = page.url();
      const pageContent = await page.content();

      if (currentUrl.includes('dashboard') || currentUrl.includes('home')) {
        result.status = 'success';
        result.message = '注册成功，已跳转到仪表板';
      } else if (currentUrl.includes('login')) {
        result.status = 'success';
        result.message = '注册成功，跳转到登录页';
      } else if (pageContent.includes('success') || pageContent.includes('成功')) {
        result.status = 'success';
        result.message = '注册成功';
      } else if (pageContent.includes('error') || pageContent.includes('错误') || pageContent.includes('already')) {
        result.status = 'failed';
        result.message = '注册失败（邮箱可能已存在）';
      } else {
        result.status = 'success';
        result.message = '流程完成';
        result.finalUrl = currentUrl;
      }

      const icon = result.status === 'success' ? '✅' : '❌';
      console.log(`  ${icon} ${result.message}\n`);

    } catch (error) {
      result.status = 'error';
      result.message = `异常: ${error.message}`;
      console.error(`  ❌ 错误: ${error.message}\n`);
      
      // 错误截图
      try {
        await page.screenshot({
          path: `${CONFIG.screenshotsDir}/${index}_error.png`,
        });
      } catch (e) {}
    } finally {
      await page.close();
      await context.close();
    }

    this.results.push(result);
    this.saveResults();
    return result;
  }

  async tryFillField(page, selectors, value) {
    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (element && await element.isVisible()) {
          await element.clear();
          await element.fill(value);
          return true;
        }
      } catch (e) {}
    }
    return false;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    fs.writeFileSync('registration_results.json', JSON.stringify(this.results, null, 2));
  }

  printStats() {
    const success = this.results.filter(r => r.status === 'success').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const error = this.results.filter(r => r.status === 'error').length;

    console.log('\n' + '='.repeat(70));
    console.log('📊 注册统计:');
    console.log(`  ✅ 成功: ${success}`);
    console.log(`  ❌ 失败: ${failed}`);
    console.log(`  ⚠️  错误: ${error}`);
    console.log(`  总计: ${this.results.length}`);
    console.log('='.repeat(70));
    console.log('\n📄 结果已保存到: registration_results.json\n');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// 主函数
async function main() {
  const count = parseInt(process.argv[2]) || 1;

  console.log('='.repeat(70));
  console.log('Vertos Dashboard 自动注册（简化版）');
  console.log('='.repeat(70));
  console.log(`目标数量: ${count}`);
  console.log(`推荐码: ${CONFIG.refCode}`);
  console.log('='.repeat(70));

  const registrar = new Registrar();

  try {
    await registrar.init();

    for (let i = 1; i <= count; i++) {
      await registrar.register(i, count);
      
      if (i < count) {
        const delay = RandomGenerator.delay(2000, 4000);
        console.log(`⏳ 等待 ${delay}/1000 秒...\n`);
        await registrar.sleep(delay);
      }
    }

    registrar.printStats();

    // 打印账号列表
    console.log('\n📝 注册成功的账号:');
    console.log('-'.repeat(70));
    console.log(`${'邮箱'.padEnd(35)} ${'用户名'.padEnd(20)} 密码`);
    console.log('-'.repeat(70));
    
    registrar.results
      .filter(r => r.status === 'success')
      .forEach(r => {
        console.log(`${r.email.padEnd(35)} ${r.username.padEnd(20)} ${r.password}`);
      });

  } catch (error) {
    console.error('\n❌ 主流程错误:', error.message);
  } finally {
    await registrar.close();
  }
}

main().catch(console.error);
