import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { getValidAccessToken } from '@/utils/keycloak';

export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  message?: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const gatewayUrl = import.meta.env.VITE_API_BASE_URL;
  if (!gatewayUrl) throw new Error('请配置 VITE_API_BASE_URL');
  const gatewayOrigin = new URL(gatewayUrl, window.location.origin).origin;
  const baseUrl = new URL(config.baseURL || gatewayUrl, window.location.origin);
  const requestOrigin = new URL(config.url || '', baseUrl).origin;
  if (requestOrigin === gatewayOrigin) {
    const token = await getValidAccessToken();
    if (token) {
      if (!config.headers) config.headers = {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const result = response.data;
    if (result.code !== 0) {
      const message = result.message || result.msg || '请求失败';
      Message.error(message);
      return Promise.reject(new Error(message));
    }
    return result;
  },
  (error) => {
    const status = error.response?.status;
    let message = error.response?.data?.message || error.message || '请求失败';
    if (status === 401) message = '登录已过期或认证失败，请重新登录';
    if (status === 403) message = '没有权限执行此操作';
    Message.error(message);
    return Promise.reject(error);
  }
);
