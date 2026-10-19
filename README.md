# Xiaoxyv · Personal Homepage

扁平、现代、纯静态的个人主页，部署在 GitHub Pages：

- 站点：<https://xiaoxyv.github.io/>
- 仓库：<https://github.com/Xiaoxyv/Xiaoxyv.github.io>
- 构建：**没有构建步骤**。没有框架、没有 npm、没有后端，只有 HTML + CSS + 一点点 JS。

## 页面结构

单页长滚动，四个区块：

| 区块 | 内容 |
|---|---|
| Hero | 名字、一句话定位、bilibili / 网易云 / 知乎入口 |
| About | 在做什么、听得最多的东西、剩余时间做什么 |
| Platforms | bilibili 与网易云的个人信息卡（头像、简介、粉丝/歌单等公开数据） |
| Harmonica | 加密的口琴练习清单（曲目数由数据决定，当前 7 首） |
| Contact | 联系方式（GitHub issue） |

> 页面**不展示任何 GitHub 项目**，About 也不基于仓库内容撰写。

## 目录结构

```
Xiaoxyv/                        ← 仓库根目录 = 站点根目录
├─ index.html                   # 全部内容都在这里
├─ 404.html                     # GitHub Pages 的 404 页
├─ assets/
│  ├─ css/main.css              # 全部样式（含深色/浅色适配与打印样式）
│  ├─ img/
│  │  ├─ bili.jpg               # bilibili 头像（112×112）
│  │  └─ netease.jpg            # 网易云头像（112×112）
│  └─ js/
│     ├─ main.js                # 平滑滚动、年份
│     └─ harmonica.js           # 口琴清单：浏览器端解密 + 渲染
├─ data/
│  └─ harmonica.enc.json        # AES-256-GCM 密文（由 Harmonica 工程生成）
├─ legacy-backup/2026-10-19/    # 旧站完整快照，仅本地留档（已 gitignore，不会部署）
└─ .gitignore
```

## 本地预览

`fetch` 读取密文需要 http(s)，所以别直接双击打开：

```powershell
cd Xiaoxyv
python -m http.server 8000
# 浏览器打开 http://127.0.0.1:8000/
```

## 「口琴待办」是怎么加密的

纯静态站没有后端，所以这里做的是**内容加密**而不是**身份认证**——
任何人都能下载密文，只有知道口令的人能解出明文。

- 算法：口令 `PBKDF2-SHA256`（210 000 次迭代 + 16 字节随机 salt）派生 256 位密钥，
  再用 `AES-256-GCM`（12 字节随机 IV）加密 `harmonica.json`，密文与认证标签一起 base64 存放。
- 解密全部在浏览器里用 WebCrypto 完成；口令不写进任何文件，也不发给任何服务器。
- 口令错了 → GCM 认证失败 → 页面只显示「口令不正确」，不会泄露任何明文片段。
- 解锁结果存在 `sessionStorage`，刷新页面即失效。

**这意味着**：口令泄露 = 内容泄露；但对于「只有我自己知道口令」的诉求，这已经足够，
而且比把明文塞进 JS 里注释掉要诚实得多。

## 更新曲谱数据

曲谱不在这个仓库里手写，而是由同级的 `../Harmonica/` 工程生成：

```
Harmonica/data/songs/*.jianpu.txt   简谱源文件（原调）
        │  node src/build.js
        ▼
Harmonica/out/harmonica.json        结构化曲谱 + 孔位指法
        │  node src/encrypt.js "<口令>"
        ▼
Xiaoxyv/data/harmonica.enc.json     本站读取的密文
```

顺序由 `Harmonica/data/songs.json` 的 `order` 决定，改顺序只改那个数组。

**曲目取舍**：只在 `order` 里登记**已经有简谱**的曲子；网上确实找不到公开简谱的，
直接不收录、页面上也不留空位（不留任何「待补」占位）。某首暂时只拿到主歌时，
在它的 `.jianpu.txt` 头部加一行 `@incomplete: 缺副歌`，页面会显示「待补充 · 缺副歌」的标签，
但指法谱照常给出。

**打印**：页面解锁后点「打印」，会展开全部曲目并套用打印样式（只打指法谱，不打导航和正文）。
`Harmonica/out/print/*.html` 是本地用的完整指法谱页，**含明文，不要拷进 `Xiaoxyv/`**——
这个目录会整棵树发布到 GitHub Pages。

## 部署

`main` 分支根目录就是站点根目录，推送即发布（GitHub Pages 通常 30 秒内生效）：

```powershell
git add -A
git commit -m "redesign: flat static homepage"
git push origin main
```

## 旧站备份

旧版页面（"Hello World" + 几个小工具）完整快照在 `legacy-backup/2026-10-19/`，
日期为拉取当天；因为站点根目录会整体部署，这个目录被 `.gitignore` 排除，仅作本地对照。
旧站内容同时也永久保留在 git 历史中（提交 `be4528d Release v1.0` 及更早）。

## 设计约定

- 一个强调色（薄荷绿 `#6ee7b7`）+ 一个次强调色（蓝），其余全部是中性灰阶。
- 圆角只有两档：`10px`（控件）和 `14px`（卡片）。
- 不用阴影，用 1px 边框和轻微位移表达层级。
- 深色为默认，跟随系统切到浅色。
- 正文最大宽度 `960px`，单栏阅读宽度 `38em`。
