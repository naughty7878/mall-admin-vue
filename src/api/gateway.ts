import axios, { AxiosRequestConfig } from 'axios';

export interface GatewayResponse<T> {
  code: number;
  message: string;
  data: T;
}

export function gatewayRequest<T>(
  apiCode: string,
  config: AxiosRequestConfig = {}
) {
  return axios.request<GatewayResponse<T>, GatewayResponse<T>>({
    ...config,
    url: '/openapi/execute',
    method: config.method || 'POST',
    headers: { ...config.headers, 'X-Api-Code': apiCode },
  });
}

export interface ServerInfo {
  id: number;
  code: string;
  name: string;
  url?: string;
}

export function listRouteServers() {
  return gatewayRequest<ServerInfo[]>('admin.route.server.list');
}
