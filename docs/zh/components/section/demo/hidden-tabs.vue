<template>
  <NSection
    title="隐藏标签栏"
    :tabs="tabs"
    hide-tab-bar
  >
    <template #tab-1>
      <p>标签页 1 的内容（标签栏已隐藏）</p>
    </template>
    <template #tab-2>
      <p>标签页 2 的内容</p>
    </template>
  </NSection>
</template>

<script setup lang="ts">
  import { NSection } from '@nova-kits/components';
  const tabs = [
    { title: '标签1', key: '1' },
    { title: '标签2', key: '2' },
  ];
</script>
