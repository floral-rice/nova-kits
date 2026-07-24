<template>
  <div style="height: 300px">
    <NLayout>
      <template #header>
        <div>顶部</div>
      </template>
      <div>main</div>
      <template #footer>
        <div>底部</div>
      </template>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { NLayout } from '@nova-kits/components';
</script>
