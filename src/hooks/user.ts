import { useUserStore } from '@/store';

export default function useUser() {
  const userStore = useUserStore();
  const logout = async () => {
    await userStore.logout();
  };
  return {
    logout,
  };
}
