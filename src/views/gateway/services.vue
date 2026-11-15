<template>
  <div class="container">
    <a-card title="服务列表">
      <a-button type="primary" :loading="loading" @click="loadServices"
        >刷新</a-button
      >
      <a-table
        :data="servers"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #columns>
          <a-table-column title="编码" data-index="code" />
          <a-table-column title="服务名" data-index="name" />
          <a-table-column title="地址" data-index="url" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { listRouteServers, ServerInfo } from '@/api/gateway';

  const servers = ref<ServerInfo[]>([]);
  const loading = ref(false);
  async function loadServices() {
    loading.value = true;
    try {
      const response = await listRouteServers();
      servers.value = response.data || [];
    } catch (error) {
      // 请求拦截器已展示错误，保留当前列表供用户重试。
    } finally {
      loading.value = false;
    }
  }
</script>

<style scoped>
  .container {
    padding: 20px;
  }
</style>
