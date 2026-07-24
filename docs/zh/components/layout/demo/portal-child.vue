<template>
  <div>
    <p>这是子组件的内容</p>
    <NLayout.Portal to="header">
      <div style="background: #e6f7ff; padding: 8px; margin: 8px 0;">
        这段内容通过 Portal 渲染到了 Header 区域
      </div>
    </NLayout.Portal>
  </div>
</template>

<script setup lang="ts">
import { NLayout } from '@nova-kits/components';
</script>
