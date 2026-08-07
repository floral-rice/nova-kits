<script setup lang="ts">
  import { ref, onMounted, render as renderVNode } from 'vue';
  import type { ICellRendererParams } from 'ag-grid-community';

  const props = defineProps<{
    params: ICellRendererParams;
    detailConfig: any;
  }>();

  const containerRef = ref<HTMLDivElement | null>(null);

  // 渲染详情内容
  function renderDetail() {
    if (!containerRef.value) return;

    const data = props.params.data;
    const rowIndex = props.params.node.rowIndex ?? 0;

    const content = props.detailConfig.render(data, rowIndex);

    if (typeof content === 'string') {
      containerRef.value.innerHTML = content;
    } else if (typeof content === 'object' && content.__v_isVNode) {
      renderVNode(content, containerRef.value);
    }
  }

  onMounted(() => {
    renderDetail();
  });
</script>

<template>
  <div
    ref="containerRef"
    class="nv-grid__detail"
  />
</template>

<style lang="scss" scoped>
  .nv-grid__detail {
    padding: 16px;
    min-height: 100px;
    background: #fafafa;
    border-top: 1px solid #ebeef5;
  }
</style>
