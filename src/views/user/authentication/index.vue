<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.authentication']" />
    <a-card class="general-card" title="Keycloak 认证信息">
      <template #extra>
        <a-button @click="readInfo">更新显示</a-button>
      </template>
      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="认证状态">
          <a-tag :color="info.authenticated ? 'green' : 'red'">
            {{ info.authenticated ? '已认证' : '未认证' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="用户 ID">{{
          info.subject || '—'
        }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{
          info.username || '—'
        }}</a-descriptions-item>
        <a-descriptions-item label="Token 过期时间">{{
          expiresAt
        }}</a-descriptions-item>
      </a-descriptions>
      <p class="hint"
        >信息来自当前浏览器的认证会话，点击“更新显示”可重新读取。</p
      >
    </a-card>

    <a-card class="general-card section" title="Token 解析内容">
      <a-collapse>
        <a-collapse-item key="access" header="Access Token 解析结果">
          <pre>{{ formatJson(info.tokenParsed) }}</pre>
        </a-collapse-item>
        <a-collapse-item key="id" header="ID Token 解析结果">
          <pre>{{ formatJson(info.idTokenParsed) }}</pre>
        </a-collapse-item>
      </a-collapse>
    </a-card>

    <a-card class="general-card section" title="Token 原文">
      <template #extra>
        <a-button size="small" @click="showTokens = !showTokens">
          {{ showTokens ? '隐藏 Token' : '显示 Token' }}
        </a-button>
      </template>
      <p class="hint">Token 是登录凭证，请勿分享给他人。</p>
      <template v-if="showTokens">
        <div v-for="token in tokens" :key="token.label" class="token">
          <strong>{{ token.label }}</strong>
          <pre>{{ token.value || '暂无数据' }}</pre>
        </div>
      </template>
      <p v-else class="hint">Token 默认隐藏，点击“显示 Token”查看。</p>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import keycloak from '@/utils/keycloak';

  function snapshot() {
    return {
      authenticated: !!keycloak.authenticated,
      subject: keycloak.subject,
      username: keycloak.tokenParsed?.preferred_username,
      token: keycloak.token,
      refreshToken: keycloak.refreshToken,
      idToken: keycloak.idToken,
      tokenParsed: keycloak.tokenParsed,
      idTokenParsed: keycloak.idTokenParsed,
    };
  }

  const info = ref(snapshot());
  const showTokens = ref(false);
  const tokens = computed(() => [
    { label: 'Access Token', value: info.value.token },
    { label: 'Refresh Token', value: info.value.refreshToken },
    { label: 'ID Token', value: info.value.idToken },
  ]);
  const expiresAt = computed(() => {
    const exp = info.value.tokenParsed?.exp;
    return exp ? new Date(exp * 1000).toLocaleString() : '暂无数据';
  });

  function readInfo() {
    info.value = snapshot();
  }

  function formatJson(value: unknown) {
    return value ? JSON.stringify(value, null, 2) : '暂无数据';
  }
</script>

<script lang="ts">
  export default { name: 'AuthenticationInfo' };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px;
  }
  .section {
    margin-top: 16px;
  }
  .hint {
    color: var(--color-text-3);
  }
  .token {
    margin-top: 16px;
  }
  pre {
    max-height: 400px;
    padding: 12px;
    overflow: auto;
    color: var(--color-text-1);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    background: var(--color-fill-2);
    border-radius: 4px;
  }
</style>
