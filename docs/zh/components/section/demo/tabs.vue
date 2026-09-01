<template>
  <NSection
    title="带标签页"
    :tabs="tabs"
    @tab-change="handleTabChange"
  >
    <template #tab-1>
      <p>标签页 1 的内容</p>
    </template>
    <template #tab-2>
      <p>标签页 2 的内容</p>
    </template>
    <template #tab-3>
      <p>标签页 3 的内容</p>
    </template>
  </NSection>
</template>

<script setup lang="ts">
  import { NSection } from '@nova-kits/components';
  const tabs = [
    { title: '标签1', key: '1' },
    { title: '标签2', key: '2' },
    { title: '标签3', key: '3' },
  ];

  const handleTabChange = (key: string, index: number) => {
    console.log('切换到标签:', key, index);
  };
</script>
