import keycloak from './keycloak';

const isLogin = () => !!keycloak.authenticated;

export { isLogin };
export default isLogin;
