<template>
  <div style="height: 300px; display: flex; flex-direction: column">
    <NSection
      title="弹性布局"
      :flex="1"
    >
      <p>这个 Section 会自动填充剩余空间</p>
    </NSection>
  </div>
</template>

<script lang="ts" setup>
  import { NSection } from '@nova-kits/components';
</script>
