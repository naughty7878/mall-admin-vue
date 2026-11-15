<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <p>使用统一身份认证登录</p>
    <a-alert v-if="errorMessage" type="error">{{ errorMessage }}</a-alert>
    <a-button type="primary" long :loading="loading" @click="handleLogin">
      {{ $t('login.form.login') }}
    </a-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '@/store';

  const route = useRoute();
  const userStore = useUserStore();
  const loading = ref(false);
  const errorMessage = ref('');

  async function handleLogin() {
    loading.value = true;
    errorMessage.value = '';
    try {
      const requested = route.query.redirect;
      const path =
        typeof requested === 'string' &&
        requested.startsWith('/') &&
        !requested.startsWith('//') &&
        !requested.includes('\\')
          ? requested
          : '/gateway/services';
      await userStore.login(new URL(path, window.location.origin).href);
    } catch (error) {
      errorMessage.value = '无法跳转登录，请检查身份认证服务配置';
      loading.value = false;
    }
  }
</script>

<style scoped>
  .login-form-wrapper {
    width: 320px;
  }
  .login-form-title {
    font-size: 24px;
    font-weight: 600;
  }
</style>
