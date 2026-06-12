# 示例输出

## 命令行输出示例

```bash
$ node register.js 3

==================================================
Vertos Dashboard 自动注册（简化版）
==================================================
目标数量: 3
推荐码: DzE8Hs1b
==================================================

[1/3] 开始注册...
  ├─ 生成数据:
  │   邮箱: abc123xyz@gmail.com
  │   用户名: user_7k9m2pd
  │   密码: Xy9#mK2$pL
  ├─ 正在打开浏览器...
  ├─ 正在访问: https://dash.vertos.in/register?ref=DzE8Hs1b
  ├─ 正在填写表单...
  ├─ 正在提交注册...
  └─ ✓ 注册成功！

[2/3] 开始注册...
  ├─ 生成数据:
  │   邮箱: def456uvw@gmail.com
  │   用户名: user_3n8q1xr
  │   密码: Pq7@nM3$tR
  ├─ 正在打开浏览器...
  ├─ 正在访问: https://dash.vertos.in/register?ref=DzE8Hs1b
  ├─ 正在填写表单...
  ├─ 正在提交注册...
  └─ ✓ 注册成功！

[3/3] 开始注册...
  ├─ 生成数据:
  │   邮箱: ghi789rst@gmail.com
  │   用户名: user_5p2w9kt
  │   密码: Yz4@oN6$vT
  ├─ 正在打开浏览器...
  ├─ 正在访问: https://dash.vertos.in/register?ref=DzE8Hs1b
  ├─ 正在填写表单...
  ├─ 正在提交注册...
  └─ ✓ 注册成功！

==================================================
注册完成！
==================================================
成功: 3
失败: 0
成功率: 100.0%
耗时: 45.2秒
==================================================
结果已保存至: registration_results.json
截图已保存至: screenshots/
==================================================
```

## registration_results.json 示例

```json
[
  {
    "序号": 1,
    "邮箱": "abc123xyz@gmail.com",
    "用户名": "user_7k9m2pd",
    "密码": "Xy9#mK2$pL",
    "注册时间": "2024-01-15 10:23:45",
    "状态": "成功",
    "截图": "screenshots/register_001_<timestamp>.png"
  },
  {
    "序号": 2,
    "邮箱": "def456uvw@gmail.com",
    "用户名": "user_3n8q1xr",
    "密码": "Pq7@nM3$tR",
    "注册时间": "2024-01-15 10:24:12",
    "状态": "成功",
    "截图": "screenshots/register_002_<timestamp>.png"
  },
  {
    "序号": 3,
    "邮箱": "ghi789rst@gmail.com",
    "用户名": "user_5p2w9kt",
    "密码": "Yz4@oN6$vT",
    "注册时间": "2024-01-15 10:24:38",
    "状态": "成功",
    "截图": "screenshots/register_003_<timestamp>.png"
  }
]
```

## GitHub Actions 输出示例

在 GitHub Actions 的运行日志中，你会看到类似的输出：

```
Starting registration process...
Target count: 10
Ref code: DzE8Hs1b

[1/10] Registering...
✓ Email: xyz123abc@gmail.com
✓ Username: user_k8n3m2p
✓ Password: [HIDDEN]
✓ Registration successful!

[2/10] Registering...
✓ Email: jkl456mnb@gmail.com
✓ Username: user_p9q2w4r
✓ Password: [HIDDEN]
✓ Registration successful!

...

Registration completed!
Success: 10/10 (100%)
Time: 2m 15s

Artifacts uploaded:
- registration_results.json
- screenshots.zip
```

## 失败情况示例

如果某个注册失败，输出会显示：

```bash
[5/10] 开始注册...
  ├─ 生成数据:
  │   邮箱: mno789pqr@gmail.com
  │   用户名: user_2t5y8u
  │   密码: Zx3@lK9$cV
  ├─ 正在打开浏览器...
  ├─ 正在访问: https://dash.vertos.in/register?ref=DzE8Hs1b
  ├─ ✗ 错误: 表单提交超时
  └─ ✗ 注册失败！

==================================================
注册完成！
==================================================
成功: 4
失败: 1
成功率: 80.0%
耗时: 52.8秒
==================================================
```
