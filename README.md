# 她主天下 · She Owns the World

一款中文分支剧情游戏：六段人生，每段五轮选择。玩家面对不同处境作出决定，留下遗物，并在紧接着的下一段人生获得一种额外做法。

[在线试玩](https://edwinaaaw.github.io/sheownstheworld/)

## 内容

- 科举、行医、纺织机、战后回家、阴婚、现代安全六个篇章。
- 根据实际结局获得遗物；使用不消耗，也不保证好结局。
- 本地自动存档、人生回顾与不覆盖正式进度的独立试读。
- 剧情场景及遗物插画。

## 本地运行

需要 Node.js 22.12 或更新版本，以及 pnpm。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开终端显示的本地地址。进度保存在当前浏览器的 localStorage 中；切换域名、浏览器或设备不会自动同步。

## 验证与构建

```sh
pnpm test
pnpm build
```

网页构建产物位于 `dist/client`，可由静态网站服务托管。源码仓库本身不是在线试玩地址。

## GitHub Pages

`main` 分支更新后，GitHub Actions 会先运行测试，再构建并发布六个篇章和全部插画。
仓库 Settings → Pages 的 Source 设为 GitHub Actions。

```sh
pnpm exec tsc -b
pnpm exec vite build --mode github-pages
```

发布目录为 `dist/client`；页面、脚本和插画均使用 `/sheownstheworld/` 项目路径。
普通本地运行和默认构建仍使用根路径。旧试玩域名的浏览器存档不会自动迁入新域名；旧存档不会被本次迁移删除。

公开仓库不等于授权自由使用；本仓库暂未指定开源许可证。
