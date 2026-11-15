<div align="center">
  <h1>Arco Design Pro</h1>
</div>

## 商城网关和 Keycloak 接入

前端使用 Keycloak 的授权码和 PKCE 登录，Token 保存在适配器内存中，请求网关前会检查并刷新 Token。开发配置在 `.env.development`：

```dotenv
VITE_API_BASE_URL=http://localhost:8888
VITE_KEYCLOAK_URL=http://192.168.1.181:30530
VITE_KEYCLOAK_REALM=mall
VITE_KEYCLOAK_CLIENT_ID=mall-admin-web
```

生产环境必须在构建时通过环境变量或 `.env.production.local` 配置浏览器可访问的网关和 Keycloak 地址；Vite 将这些值写入静态构建产物。Keycloak 客户端应为公开客户端，开启标准流程与 PKCE S256，配置前端的重定向 URI、注销后重定向 URI 和 Web Origins，并将 `mall-gateway-audience` 添加为默认客户端作用域。前端不得配置客户端密钥。开发时需使用 `localhost` 或 HTTPS 等安全上下文以使用 PKCE。

登录后打开“网关管理 → 服务列表”，点击刷新会通过 `/openapi/execute` 调用 `admin.route.server.list`；网关中必须已配置该 API，且能访问 `mall-admin`。现有模板 mock 已禁用，其余 `/api/...` 示例页面尚未接入商城后端。前端角色来自 Token 的 realm 或 `mall-admin-web` 客户端角色，缺少 `admin` 时按普通用户显示；菜单控制不能替代后端授权。目前网关尚未实现 API 级授权。

启动开发服务：`pnpm install`，然后 `pnpm dev`。确保浏览器能访问 Keycloak 和网关，且两者均允许前端来源跨域。网关和业务服务的地址及路由配置应按实际部署环境设置。

<div align="center">

基于 [Arco Design](https://arco.design/) Vue 组件库的开箱即用的中后台前端解决方案。

Admin 中后台管理页面，创新的多架构方案。

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/arco-design/arco-design-pro/blob/main/LICENSE)

</div>


<div align="center">

[English](./README.md) | 简体中文

</div>

![f769c408-adf4-4a85-b4a5-cc0d7e7f29ef](https://user-images.githubusercontent.com/19399269/148364725-b7a36383-04a9-4d67-87a4-91e970d0d083.gif)

## ✨ Features

- **TypeScript**  -  代码完全使用 TypeScript 书写。
- **Vue3** - 面向未来，拥抱 Vue3。
- **Pinia** - 紧跟潮流，美味可口。
- **Arco Design**  -  由 [ArcoDesign Vue](https://github.com/arco-design/arco-design-vue) 组件库强力驱动。
- **Templates** - 16+ 页面模版，覆盖表格、列表、表单、工作台、可视化等场景。
- **Themes** - 基于「[风格配置平台](https://arco.design/themes)」丰富的主题市场，让你的项目千变万化。
- **Dark Theme**  -  一键丝滑切换暗黑风格。
- **Mock**  -  内置 api 模拟方案，代码即注释，更加仿真线上环境。
- **I18n** - 内置国际化多语言解决方案。
- **Config** - 灵活配置页面配色、布局等。


## 🌈 安装步骤
node 版本：20.12.1

```bash
# 安装 pnpm
$ npm install -g pnpm

# 创建项目
$ pnpm create arco-pro@latest 
C:\Users\H__D\Desktop>pnpm create arco-pro@latest
.../197e53c17dd-a094                     |  +32 +++
.../197e53c17dd-a094                     | Progress: resolved 32, reused 29, downloaded 3, added 32, done

Welcome! Let’s Build with create-arco!

√ 请输入项目名称 : mall-admin-vue
? 请选择你希望使用的技术栈 » 箭头键选择，回车键确认
 > Vue
? 请选择你希望使用的技术栈 » 箭头键选择，回车键确认
   Vue
? 请选择你希望使用的技术栈 » 箭头键选择，回车键确认
 > Vue
√ 请选择你希望使用的技术栈 : Vue
? 请选择版本 » 箭头键选择，回车键确认
 > 基础版
   完整版
? 请选择版本 » 箭头键选择，回车键确认
   基础版
 > 完整版
? 请选择版本 » 箭头键选择，回车键确认
   基础版
   完整版
? 请选择版本 » 箭头键选择，回车键确认
   基础版
 > 完整版
√ 请选择版本 : 完整版
? 请选择包管理器 » 箭头键选择，回车键确认
 > pnpm  推荐
   yarn
√ 请选择包管理器 : pnpm
√ 是否初始化Git : No
√ 确认生成项目吗 : Yes
✔ 初始化完成
✔ 项目依赖安装成功

🎉快速开始:
   - cd mall-admin-vue
   - pnpm run dev
```

## 🔗 Link

- [Arco Design Pro 官网](https://pro.arco.design)
- [预览](https://vue-pro.arco.design)

## 💎 Changelog

- [中文版](https://github.com/arco-design/arco-design-pro-vue/blob/main/docs/changelog.zh-CN.md)

- [英文版](https://github.com/arco-design/arco-design-pro-vue/blob/main/docs/changelog.md)

## LICENSE

[MIT](./LICENSE) © [ArcoDesign](https://arco.design)
