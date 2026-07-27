<template>
  <div style="height: 400px; border: 1px solid #eee">
    <NBasicLayout
      title="管理系统"
      :menus="menus"
      :auth="authConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { NBasicLayout } from '@nova-kits/kits';

const menus = [
  { name: '首页', path: '/home' },
  { name: '用户管理', path: '/user' },
];

const authConfig = {
  redirectURL: '/login',
  check: async () => {
    // 模拟鉴权请求
    return { user: 'admin' };
  },
  onSuccess: (res: any) => {
    console.log('鉴权成功', res);
  },
  onFail: (err: Error) => {
    console.error('鉴权失败', err);
  },
};
</script>
