<template>
  <div style="height: 400px; border: 1px solid #eee">
    <NBasicLayout title="管理系统" :menus="menus" :top-tabs="topTabs" />
  </div>
</template>

<script setup lang="ts">
import { NBasicLayout } from '@nova-kits/kits';

const menus = [
  {
    name: '首页',
    path: '/home',
  },
  {
    name: '系统管理',
    children: [
      { name: '用户管理', path: '/system/user' },
      { name: '角色管理', path: '/system/role' },
    ],
  },
];

const topTabs = [{ title: '首页', path: '/home' }];
</script>
