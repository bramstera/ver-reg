# Vertos Dashboard 自动注册系统

使用 GitHub Actions + WARP IP 轮换 + Playwright 实现批量自动注册。

## ✨ 特性

✅ **WARP IP 轮换** - 每次运行使用不同 IP
✅ **随机 Gmail 邮箱** - 自动生成 `@gmail.com` 格式邮箱
✅ **随机用户名密码** - 每个账号完全随机
✅ **GitHub Actions** - 云端自动运行
✅ **截图记录** - 全程截图存档
✅ **JSON 结果** - 账号信息结构化存储

## 📦 项目结构

```
vertos-github-actions/
├── .github/workflows/
│   └── register.yml       # GitHub Actions 工作流
├── register.js            # Playwright 注册脚本
├── package.json
└── README.md
```

## 🚀 快速使用

### 1. 推送到 GitHub

```bash
cd /home/workspace/vertos-github-actions

git init
git add .
git commit -m "🚀 Vertos auto-register"

git remote add origin https://github.com/YOUR_USERNAME/vertos-register.git
git push -u origin main
```

### 2. 运行注册

1. 打开 GitHub 仓库
2. 点击 **Actions** 标签
3. 点击左侧 **Vertos Auto Register**
4. 点击 **Run workflow**
5. 输入参数：
   - 注册账号数量: `10`
   - 推荐码: `DzE8Hs1b`
6. 点击绿色按钮运行

### 3. 查看结果

运行完成后下载 Artifacts：
- `screenshots` - 注册过程截图
- `registration-results` - 账号信息 JSON

## 📋 生成的数据格式

### Gmail 邮箱
```
abc123xyz789@gmail.com
```
- 10 位随机字符（字母+数字）
- 标准格式，可直接使用

### 用户名
```
HappyFox5678
```
- 格式: `形容词 + 名词 + 4位数字`
- 易读易记

### 密码
```
Abc123!@#xyz
```
- 12 位强密码
- 包含大小写字母 + 数字 + 特殊字符

## 📊 运行示例

```
======================================================================
Vertos Dashboard 自动注册（简化版）
======================================================================
目标数量: 10
推荐码: DzE8Hs1b
======================================================================

🚀 启动浏览器...
  ✓ 浏览器已启动

[1/10] 开始注册
  📧 邮箱: abc123xyz789@gmail.com
  👤 用户名: HappyFox5678
  🔑 密码: Abc123!@#xyz
  🌐 IP: 104.28.123.45
  → 正在访问...
  → 填写表单...
  → 提交注册...
  ✅ 注册成功，已跳转到仪表板

[2/10] 开始注册
  ...

======================================================================
📊 注册统计:
  ✅ 成功: 10
  ❌ 失败: 0
  ⚠️  错误: 0
  总计: 10
======================================================================

📄 结果已保存到: registration_results.json

📝 注册成功的账号:
----------------------------------------------------------------------
邮箱                              用户名              密码
----------------------------------------------------------------------
abc123xyz789@gmail.com           HappyFox5678        Abc123!@#xyz
```

## 💾 结果文件 (JSON)

```json
[
  {
    "index": 1,
    "email": "abc123xyz789@gmail.com",
    "username": "HappyFox5678",
    "password": "Abc123!@#xyz",
    "timestamp": "2026-06-12T10:15:30.000Z",
    "status": "success",
    "message": "注册成功，已跳转到仪表板",
    "ip": "104.28.123.45"
  }
]
```

## 🎯 优化说明

相比之前的版本，这个简化版：

1. ❌ **移除了 Buster 扩展** - 网站已关闭验证码
2. ❌ **移除了邮件验证处理** - 网站已关闭邮箱验证
3. ✅ **简化了安装流程** - 只需安装 Playwright
4. ✅ **提高了运行速度** - 每个账号约 5-10 秒
5. ✅ **降低了出错率** - 没有验证码干扰

## ⚙️ 自定义配置

修改 `register.js` 文件顶部的 CONFIG：

```javascript
const CONFIG = {
  baseUrl: 'https://dash.vertos.in/register',
  refCode: 'DzE8Hs1b',
  headless: true,
  timeout: 30000,
};
```

## ⚠️ 注意事项

1. **运行时间**
   - 每个账号约 5-10 秒
   - 注册 10 个账号约需 2 分钟

2. **成功率**
   - 理论上应该是 100%（无验证码）
   - 如果失败，查看截图诊断

3. **IP 轮换**
   - GitHub Actions 每次运行使用不同 IP
   - WARP 确保干净的 IP 地址

4. **免费额度**
   - GitHub Actions 免费用户每月 2000 分钟
   - 注册 10 个账号消耗约 5 分钟

## 🐛 故障排查

### 问题：表单填写失败

**解决方案**：
- 查看 `screenshots/` 截图
- 检查网页布局是否变化
- 可能需要更新表单选择器

### 问题：无法访问网站

**解决方案**：
- 检查 WARP 是否正常启动
- 查看 Actions 日志中的 IP 地址
- 可能需要等待 WARP 连接稳定

## 📞 支持

如遇问题，请：
1. 查看 GitHub Actions 详细日志
2. 下载 `screenshots` 查看操作过程
3. 检查 `registration_results.json` 中的错误信息
