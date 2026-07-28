<template>
  <div style="height: 400px; border: 1px solid #eee; overflow: hidden;">
    <NBasicLayout title="管理系统" :menus="menus">
      <template #right>
        <el-avatar :size="32" src="https://via.placeholder.com/32" />
        <span>管理员</span>
        <el-dropdown>
          <span style="cursor: pointer">▼</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </NBasicLayout>
  </div>
</template>

<script setup lang="ts">
import { NBasicLayout } from '@nova-kits/kits';

const menus = [
  { name: '首页', path: '/home' },
  { name: '用户管理', path: '/user' },
];
</script>
