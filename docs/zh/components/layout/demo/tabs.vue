<template>
  <div style="height: 400px; overflow: hidden">
    <NLayout.Tabs
      v-model:active-key="activeKey"
      v-model:collapsed="collapsed"
      :tabs="tabs"
      :default-sidebar-width="242"
    >
      <template #header>
        <div style="padding: 12px 0">
          标签页布局示例
        </div>
      </template>
      <template #left>
        <div style="padding: 12px; height: 500px;">
          <p>侧边栏内容</p>
          <p>拖拽右侧边框调整宽度</p>
          <p>状态: {{ collapsed ? '已折叠' : '已展开' }}</p>
        </div>
      </template>
      <template #tab1>
        <div style="padding: 12px; height: 700px;">
          <p>标签页 1 的内容</p>
        </div>
      </template>
      <template #tab2>
        <div style="padding: 12px">
          <p>标签页 2 的内容</p>
        </div>
      </template>
      <template #tab3>
        <div style="padding: 12px">
          <p>标签页 3 的内容</p>
        </div>
      </template>
    </NLayout.Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NLayout } from '@nova-kits/components';

const activeKey = ref('tab1');
const collapsed = ref(false);
const tabs = [
  { key: 'tab1', label: '标签页 1' },
  { key: 'tab2', label: '标签页 2' },
  { key: 'tab3', label: '标签页 3' },
];
</script>
