<script setup lang="ts">
  import type { ICellRendererParams } from 'ag-grid-community';

  const props = defineProps<{
    params: ICellRendererParams;
  }>();

  // 计算序号
  const index = props.params.node.rowIndex != null ? props.params.node.rowIndex + 1 : '';
</script>

<template>
  <div class="nv-grid__cell-index">
    {{ index }}
  </div>
</template>
