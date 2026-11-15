import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const GATEWAY: AppRouteRecordRaw = {
  path: '/gateway',
  name: 'gateway',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.gateway',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 1,
  },
  children: [
    {
      path: 'services',
      name: 'GatewayServices',
      component: () => import('@/views/gateway/services.vue'),
      meta: {
        locale: 'menu.gateway.services',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default GATEWAY;
