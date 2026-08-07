<script setup lang="ts">
  import { computed } from 'vue';
  import type { IHeaderParams } from 'ag-grid-community';
  import type { ColType } from '../typings';

  const props = defineProps<{
    params: IHeaderParams;
  }>();

  const colDef = props.params.column.getColDef() as ColType<any>;

  // 标题
  const title = computed(() => {
    if (typeof colDef.title === 'function') {
      return colDef.title(props.params);
    }
    return colDef.title || colDef.headerName || '';
  });

  // 排序状态
  const sortState = computed(() => {
    return props.params.column.getSort() || null;
  });

  // 点击排序
  function onSort() {
    const nextSort = sortState.value === 'asc' ? 'desc' : sortState.value === 'desc' ? null : 'asc';
    props.params.setSort(nextSort, true);
  }
</script>

<template>
  <div
    class="nv-grid__header"
    @click="onSort"
  >
    <span class="nv-grid__header-title">{{ title }}</span>
    <span
      v-if="sortState"
      class="nv-grid__header-sort"
    >
      <el-icon v-if="sortState === 'asc'"><Top /></el-icon>
      <el-icon v-else><Bottom /></el-icon>
    </span>
  </div>
</template>
