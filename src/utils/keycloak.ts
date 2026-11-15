import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'mall',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'mall-admin-web',
});
let loginRedirectStarted = false;

export async function initializeKeycloak() {
  if (!import.meta.env.VITE_KEYCLOAK_URL) {
    throw new Error('请配置 VITE_KEYCLOAK_URL');
  }
  return keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  });
}

export async function getValidAccessToken() {
  if (!keycloak.authenticated) return undefined;
  try {
    await keycloak.updateToken(30);
    return keycloak.token;
  } catch (error) {
    keycloak.clearToken();
    if (!loginRedirectStarted) {
      loginRedirectStarted = true;
      keycloak.login({ redirectUri: window.location.href }).catch(() => {
        loginRedirectStarted = false;
      });
    }
    throw new Error('登录已过期，请重新登录');
  }
}

export default keycloak;
