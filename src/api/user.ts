import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';

export default function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
