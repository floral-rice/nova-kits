<template>
  <NLayout
    v-model:collapsed="collapsed"
    :default-sidebar-width="242"
  >
    <template #header>
      <div style="padding: 12px 0;">
        Portal 示例 - Header
      </div>
    </template>
    <template #left>
      <div style="padding: 12px;">
        <p>侧边栏内容</p>
        <p>拖拽右侧边框调整宽度</p>
        <p>状态: {{ collapsed ? '已折叠' : '已展开' }}</p>
      </div>
    </template>
    <div style="padding: 12px;">
      <p>主内容区域</p>
      <ChildComponent />
    </div>
    <template #footer>
      <div>Portal 示例 - Footer</div>
    </template>
  </NLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NLayout } from '@nova-kits/components';
import ChildComponent from './portal-child.vue';

const collapsed = ref(false);
</script>
