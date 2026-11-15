# Docker 部署

镜像使用 Node 构建静态文件，再由 Nginx 提供服务。项目使用 Vue Router 的 history 模式，Nginx 将不存在的页面路径回退到 `index.html`，以支持直接访问或刷新业务页面。默认部署在域名根路径 `/`。

## 构建镜像

先在项目根目录的 `.env.production` 中配置**用户浏览器可访问的生产地址**，例如：

```dotenv
VITE_API_BASE_URL=https://gateway.example.com
VITE_KEYCLOAK_URL=https://auth.example.com
VITE_KEYCLOAK_REALM=mall
VITE_KEYCLOAK_CLIENT_ID=mall-admin-web
```

然后在项目根目录执行：

```bash
docker build -t mall-admin-vue:1.0.0 .
```

不要使用浏览器无法访问的 Docker 内部服务名，`localhost` 指的是访问用户自己的电脑。

Vite 在**构建时**读取 `.env.production` 并将这些值写入前端静态文件；通过 `docker run -e` 修改环境变量不会改变已构建的前端。修改文件后需重新构建镜像。配置会暴露给浏览器，不能放客户端密钥等敏感信息。

## 运行

```bash
docker run -d --name mall-admin-vue --restart unless-stopped -p 8080:80 mall-admin-vue:1.0.0
```

访问 `http://服务器地址:8080`。生产环境应通过 HTTPS 反向代理或负载均衡暴露服务；Keycloak PKCE 需要 HTTPS 或 localhost 等安全上下文。Nginx 只提供前端静态文件，不代理网关或 Keycloak。

在 Keycloak 客户端中配置实际前端地址的 Valid Redirect URIs、Valid Post Logout Redirect URIs 和 Web Origins；网关和 Keycloak 也要允许前端来源跨域。地址、端口及协议必须与浏览器实际访问的 origin 匹配。

## 验证

1. 打开首页并完成 Keycloak 登录，确认能够回到目标页面。
2. 直接访问并刷新 `/gateway/services` 和 `/user/authentication`，确认不会出现 Nginx 404。
3. 在 Network 中确认请求目标为生产网关，且网关请求携带 Bearer Access Token。
4. 检查浏览器控制台、跨域错误和容器日志：`docker logs mall-admin-vue`。

若托管在子路径而不是域名根路径，还需同步调整 Vite `base`、Vue Router history base、Nginx 和 Keycloak 回跳配置；当前配置不覆盖这一部署方式。
