# 使用指南

## 📦 部署步骤

### 1️⃣ 创建 GitHub 仓库

```bash
# 初始化 Git
cd vertos-github-actions
git init
git add .
git commit -m "Initial commit: Vertos auto-register"

# 推送到 GitHub（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/vertos-register.git
git push -u origin main
```

### 2️⃣ 在 GitHub 仓库中启用 Actions

1. 进入仓库页面
2. 点击 **Actions** 标签
3. 如果提示启用，点击 **I understand my workflows, go ahead and enable them**

### 3️⃣ 手动触发工作流

1. 点击左侧的 **Vertos Auto Register** 工作流
2. 点击右侧的 **Run workflow** 按钮
3. 填写参数：
   - **注册账号数量**: 输入要注册的数量（默认10）
   - **推荐码**: 保持默认或修改
4. 点击绿色按钮 **Run workflow**

## 🎮 运行方式选择

### 方式一：手动触发（推荐）

通过 GitHub Actions 界面手动运行，每次执行时自动换 IP。

**优点**：
- ✅ 完全免费（GitHub Actions 提供免费额度）
- ✅ 每次运行自动换 IP
- ✅ 可视化日志和截图
- ✅ 不消耗本地资源

### 方式二：本地运行

使用 WARP Cloudflare WARP 客户端在本地运行。

**优点**：
- ✅ 更快的调试速度
- ✅ 本地浏览器可视化

**缺点**：
- ❌ 需要本地安装环境
- ❌ 需要手动管理 IP 轮换

## 📊 查看结果

### GitHub Actions 方式

1. 进入 Actions 页面
2. 点击具体的运行记录
3. 在 **Artifacts** 区域下载以下文件：
   - `screenshots`: 所有操作截图
   - `registration_results.json`: 注册成功的账号信息

### 本地运行方式

查看以下文件：
- `screenshots/`: 截图目录
- `registration_results.json`: 账号信息 JSON

## 🔧 高级配置

### 修改并发数量

编辑 `.github/workflows/register.yml`:

```yaml
- name: Run registration
  env:
    REGISTER_COUNT: ${{ github.event.inputs.count || '10' }}
  run: |
    xvfb-run -a node register.js $REGISTER_COUNT
```

### 自定义延迟时间

编辑 `register.js` 中的配置：

```javascript
const CONFIG = {
  // ...
  delays: {
    pageLoad: 5000,      // 页面加载等待
    formFill: 1000,      // 表单填写间隔
    captcha: 10000,       // 验证码处理超时
    submission: 3000,     // 提交后等待
  }
};
```

### 添加代理支持

如果需要固定代理而不是 WARP，修改 `register.js`:

```javascript
const browser = await chromium.launch({
  headless: CONFIG.headless,
  proxy: {
    server: 'http://your-proxy:port',
    username: 'user',
    password: 'pass'
  },
  args: chromiumArgs
});
```

## ⚠️ 注意事项

1. **GitHub Actions 限制**
   - 免费账户每月 2000 分钟
   - 每次注册约消耗 2-3 分钟
   - 建议单次运行不超过 50 个账号

2. **验证码处理**
   - Buster 对 reCAPTCHA v2 成功率约 70-80%
   - 如果失败，会保存截图并继续下一个

3. **IP 轮换**
   - GitHub Actions 每次运行使用不同 IP
   - WARP 确保每次都是干净的 IP 地址

4. **失败处理**
   - 脚本会自动跳过失败的注册
   - 所有截图都会保存在 Artifacts 中
   - 只有成功的账号会写入 results JSON

## 🐛 故障排查

### 问题：Buster 无法加载

**解决方案**：
- 检查 `extensions/buster/unpacked` 目录是否存在
- 确认 `manifest.json` 文件完整

### 问题：验证码超时

**解决方案**：
- 增加 `CONFIG.timeout` 值
- 检查截图确认验证码类型
- 可能需要手动处理复杂验证码

### 问题：表单提交失败

**解决方案**：
- 查看 `screenshots/error_*.png` 截图
- 检查 `error_*.png` 截图
- 增加 `CONFIG.delays.submission` 延迟

## 📞 支持

如有问题，请查看 GitHub Actions 的详细日志，或下载截图进行诊断。
