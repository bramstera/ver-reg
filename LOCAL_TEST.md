# 本地测试指南

## 方式 1: 直接运行（无 WARP）

```bash
# 安装依赖
npm install

# 单次测试
node register.js

# 批量测试
node register.js 5
```

## 方式 2: 使用 Docker 模拟 GitHub Actions 环境

```bash
# 构建镜像
docker build -t vertos-register .

# 运行容器
docker run vertos-register
```

## 方式 3: 使用 act 本地运行 GitHub Actions

```bash
# 安装 act
brew install act  # macOS
# 或
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# 本地运行 workflow
act -W .github/workflows/register.yml
```

## 方式 4: 本地安装 WARP 手动测试

```bash
# 依赖
npm install

# 安装 WARP CLI（Linux）
curl https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflare-client.list
sudo apt update
sudo apt install cloudflare-warp

# 注册并连接 WARP
warp-cli register
warp-cli connect

# 验证 IP 已更换
curl -sS 'https://www.cloudflare.com/cdn-cgi/trace' | grep -E '^ip'

# 运行脚本
node register.js
```
