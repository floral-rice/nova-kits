<script setup lang="ts">
  import type { ICellRendererParams } from 'ag-grid-community';

  // AG Grid Vue3 传递的是 params 对象
  const props = defineProps<{
    params: ICellRendererParams & {
      render?: (value: any, record: any, rowIndex: number, params: any) => any;
    };
  }>();

  // 渲染内容
  function renderContent() {
    const p = props.params;
    const renderFn = p.render;
    if (renderFn) {
      return renderFn(p.value, p.data, p.node.rowIndex ?? 0, p);
    }

    if (p.value === null || p.value === undefined) {
      return '';
    }

    return String(p.value);
  }
</script>

<template>
  <div
    class="nv-grid__cell"
    :title="String(props.params.value || '')"
  >
    <template v-if="typeof renderContent() === 'object'">
      <component :is="renderContent()" />
    </template>
    <template v-else>
      {{ renderContent() }}
    </template>
  </div>
</template>
