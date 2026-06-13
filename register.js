/**
 * Vertos Dashboard 自动注册脚本（修复版）
 * 针对实际表单结构优化
 */

const { chromium } = require('playwright');
const fs = require('fs');

// 配置
const CONFIG = {
  baseUrl: 'https://dash.vertos.in/register',
  refCode: '5AeDoVSK',
  headless: true,
  screenshotsDir: 'screenshots',
  timeout: 60000
};

// 生成随机字符串
function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// 生成随机邮箱
function randomEmail() {
  return `${randomString(10)}@gmail.com`;
}

// 生成随机用户名
function randomUsername() {
    const firstNames = [
        'alex', 'jack', 'ethan', 'ryan', 'lucas',
        'logan', 'jason', 'leo', 'mason', 'dylan',
        'emma', 'mia', 'lily', 'sophia', 'ava',
        'olivia', 'grace', 'chloe','tice','kya','gar','dtual','niz','cwo','mo','tion','sti','dtu','nica','lya','try','men','de','gem', 'pre', 'str', 'ment', 'un', 'ble', 'inter', 'co', 'dis', 'sion', 'sta', 'ness', 'pro', 'tur', 'ex', 'con', 'able', 'sti', 'tion', 'sub', 'ment', 'over', 'tri', 'ence', 'mis', 'sion', 'trans', 'pre', 'ance', 'gra', 'under', 'inter', 'tion', 'extra', 'sta', 'sti', 'con', 'dis', 'sub', 'mis', 'tri', 'str', 'ment', 'tion', 'sion', 'ness', 'able', 'ture', 'ence', 'ance', 'over', 'under', 'inter', 'trans', 'extra', 'ation', 'sible', 'tious', 'cious', 'phous', 'tment', 'sta', 'sti', 'pre', 'pro', 'con', 'dis', 'sub', 'mis', 'tri', 'str', 'ment', 'tion', 'sion', 'ness', 'able', 'ture', 'ence', 'ance', 'over', 'under', 'inter', 'trans', 'extra', 'ation', 'sible', 'tious', 'cious', 'phous', 'tment', 'sta', 'sti', 'pre', 'pro', 'con', 'dis', 'sub', 'mis'
    ];

    const lastNames = [
        'smith', 'johnson', 'brown', 'wilson',
        'miller', 'moore', 'lee', 'taylor',
        'anderson', 'clark', 'white', 'hall',
        'young', 'king', 'wright','nic','gooa','ska','dry','ma','kaw','sta','stmil','pol','duo','ley','duy','by','ly','sy', 'zi', 'sta', 'sti', 'pre', 'pro', 'con', 'dis', 'sub', 'mis', 'tri', 'str', 'men', 'tio', 'sio', 'nes', 'abl', 'tur', 'enc', 'anc', 'ove', 'und', 'int', 'tra', 'ext', 'ati', 'sib', 'tio', 'cio', 'pho', 'tme', 'gra', 'ple', 'ble', 'cle', 'dle', 'fle', 'gle', 'kle', 'ple', 'tle', 'bre', 'cre', 'dre', 'fre', 'gre', 'kre', 'pre', 'tre', 'bre', 'cre', 'dre', 'fre', 'gre', 'pre', 'tre', 'ble', 'cle', 'dle', 'fle', 'gle', 'ple', 'tle', 'bre', 'cre', 'dre', 'fre', 'gre', 'pre', 'tre', 'ment', 'tion', 'sion', 'ness', 'able', 'ture', 'ence', 'ance', 'over', 'under', 'inter', 'trans', 'extra', 'ation', 'sible', 'tious', 'cious', 'phous', 'tment', 'graph', 'phone', 'scope', 'tract', 'press', 'gress', 'gress', 'spect', 'dict', 'duct', 'ject', 'port', 'struct', 'tend', 'vent', 'vert', 'view', 'vis', 'aud', 'cred', 'fid', 'form', 'ject', 'lect', 'mit', 'pend', 'rupt', 'scrib', 'sequ', 'sign', 'tend', 'tract', 'vent', 'vert', 'vis'
    ];

    const patterns = [
        (f, l) => `${f}${l}`,
        (f, l) => `${f}_${l}`,
        (f, l) => `${f}.${l}`,
        (f, l) => `${f}${l.slice(0, 3)}`,
        (f, l) => `${f.slice(0, 1)}${l}`,
        (f, l) => `${f}${l.slice(0, 1)}`
    ];

    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    return pattern(first, last);
}

// 生成强密码
function randomPassword(length = 12) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%^&*';
  const all = upper + lower + digits + special;
  
  let password = '';
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// 主注册函数
async function register(browser, index) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const result = {
    index,
    email: randomEmail(),
    username: randomUsername(),
    password: randomPassword(),
    timestamp: new Date().toISOString(),
    status: 'pending',
    message: '',
    ip: ''
  };
  
  try {
    console.log(`${index}. 开始注册...`);
    console.log(`   📧 邮箱: ${result.email}`);
    console.log(`   👤 用户名: ${result.username}`);
    console.log(`   🔑 密码: ${result.password}`);
    
    // 访问注册页面
    await page.goto(`${CONFIG.baseUrl}?ref=${CONFIG.refCode}`, { 
      waitUntil: 'networkidle',
      timeout: CONFIG.timeout 
    });
    
    await page.screenshot({ 
      path: `${CONFIG.screenshotsDir}/${index}_01_loaded.png` 
    });
    console.log(`   ✅ 页面已加载`);
    
    // 等待表单加载
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    
    // 填写表单 - 使用正确的选择器
    console.log(`   📝 填写表单...`);
    
    // Username
    await page.fill('input[name="name"]', result.username);
    console.log(`      ✓ Username 已填写`);
    
    // Email
    await page.fill('input[name="email"]', result.email);
    console.log(`      ✓ Email 已填写`);
    
    // Password
    await page.fill('input[name="password"]', result.password);
    console.log(`      ✓ Password 已填写`);
    
    // Retype password
    await page.fill('input[name="password_confirmation"]', result.password);
    console.log(`      ✓ Password confirmation 已填写`);
    
    await page.screenshot({ 
      path: `${CONFIG.screenshotsDir}/${index}_02_filled.png` 
    });
    
    // 等待一下确保所有字段都填写完毕
    await page.waitForTimeout(1000);
    
    // 提交表单
    console.log(`   🚀 提交注册...`);
    await page.click('button[type="submit"]');
    
    // 等待响应
    await page.waitForTimeout(3000);
    
    await page.screenshot({ 
      path: `${CONFIG.screenshotsDir}/${index}_03_submitted.png` 
    });
    
    // 获取当前 IP
    try {
      result.ip = await page.evaluate(async () => {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          return data.ip;
        } catch {
          return 'unknown';
        }
      });
    } catch {
      result.ip = 'unknown';
    }
    
    // 检查是否成功（检查 URL 或页面内容）
    const currentUrl = page.url();
    const pageContent = await page.content();
    
    if (currentUrl.includes('login') || 
        pageContent.includes('success') || 
        pageContent.includes('registered') ||
        pageContent.includes('Registration successful')) {
      result.status = 'success';
      result.message = '注册成功';
      console.log(`   ✅ 注册成功！`);
    } else {
      result.status = 'completed';
      result.message = '注册流程完成，请检查结果';
      console.log(`   ⚠️  注册流程完成，请检查截图`);
    }
    
  } catch (error) {
    result.status = 'error';
    result.message = error.message;
    console.log(`   ❌ 错误: ${error.message}`);
    
    await page.screenshot({ 
      path: `${CONFIG.screenshotsDir}/${index}_error.png` 
    });
  }
  
  await context.close();
  return result;
}

// 主函数
async function main() {
  const count = parseInt(process.argv[2] || '1', 10);
  
  console.log('='.repeat(70));
  console.log('Vertos Dashboard 自动注册（修复版）');
  console.log('='.repeat(70));
  console.log(`目标数量: ${count}`);
  console.log(`推荐码: ${CONFIG.refCode}`);
  console.log('='.repeat(70));
  console.log('');
  
  // 创建截图目录
  if (!fs.existsSync(CONFIG.screenshotsDir)) {
    fs.mkdirSync(CONFIG.screenshotsDir, { recursive: true });
  }
  
  const results = [];
  const browser = await chromium.launch({ 
    headless: CONFIG.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  for (let i = 1; i <= count; i++) {
    const result = await register(browser, i);
    results.push(result);
    
    // 延迟避免被检测
    if (i < count) {
      const delay = Math.random() * 3000 + 2000;
      console.log(`   ⏱️  等待 ${(delay / 1000).toFixed(1)} 秒...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    console.log('');
  }
  
  await browser.close();
  
  // 保存结果
  fs.writeFileSync('registration_results.json', JSON.stringify(results, null, 2));
  
  // 显示统计
  console.log('='.repeat(70));
  console.log('📊 注册完成统计');
  console.log('='.repeat(70));
  console.log(`✅ 成功: ${results.filter(r => r.status === 'success').length}`);
  console.log(`⚠️  完成: ${results.filter(r => r.status === 'completed').length}`);
  console.log(`❌ 错误: ${results.filter(r => r.status === 'error').length}`);
  console.log(`📊 总计: ${results.length}`);
  console.log('='.repeat(70));
  console.log('');
  
  // 显示结果表格
  console.log('📋 注册账号列表:');
  console.log('-'.repeat(70));
  console.log('邮箱                                用户名            密码');
  console.log('-'.repeat(70));
  results.forEach(r => {
    console.log(`${r.email.padEnd(35)} ${r.username.padEnd(17)} ${r.password}`);
  });
  console.log('-'.repeat(70));
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
