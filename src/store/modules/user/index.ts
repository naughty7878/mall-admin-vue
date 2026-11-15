import { defineStore } from 'pinia';
import keycloak from '@/utils/keycloak';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const claims = keycloak.tokenParsed;
      if (!keycloak.authenticated || !claims) throw new Error('用户未登录');
      const roles = [
        ...(claims.realm_access?.roles || []),
        ...(claims.resource_access?.[keycloak.clientId || '']?.roles || []),
      ];
      this.setInfo({
        name: claims.name || claims.preferred_username || claims.sub,
        email: claims.email,
        accountId: claims.sub,
        role: roles.includes('admin') ? 'admin' : 'user',
      });
    },

    // Login
    async login(redirectUri?: string) {
      await keycloak.login({ redirectUri });
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      this.logoutCallBack();
      await keycloak.logout({ redirectUri: `${window.location.origin}/` });
    },
  },
});

export default useUserStore;
