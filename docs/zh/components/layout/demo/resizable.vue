<template>
  <div style="height: 400px; overflow: hidden">
    <NLayout v-model:collapsed="collapsed" :default-sidebar-width="242">
      <template #header>
        <div style="padding: 12px 0">
          可拖拽侧边栏示例
        </div>
      </template>
      <template #left>
        <div style="padding: 12px; height: 600px">
          <p>侧边栏内容</p>
          <p>拖拽右侧边框调整宽度</p>
          <p>状态: {{ collapsed ? '已折叠' : '已展开' }}</p>
        </div>
      </template>
      <div style="padding: 12px; height: 600px;">
        <p>主内容区域</p>
        <p>拖拽右侧边框调整宽度，点击按钮折叠/展开</p>
      </div>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NLayout } from '@nova-kits/components';

const collapsed = ref(false);
</script>
