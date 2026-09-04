<template>
  <div class="nv-pagination-bar">
    <!-- 左侧自定义内容 -->
    <div class="nv-pagination-bar__left">
      <slot name="left" />
    </div>

    <!-- 右侧分页器 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="pageSizes"
      :layout="layout"
      background
      @current-change="onCurrentChange"
      @size-change="onSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataTableConfig } from '../composables/useDataTableConfig';

const props = defineProps<{
  current: number;
  pageSize: number;
  total: number;
  pageSizes?: number[];
  layout?: string;
}>();

const emit = defineEmits<{
  'update:current': [value: number];
  'update:page-size': [value: number];
}>();

const config = useDataTableConfig();

const currentPage = computed({
  get: () => props.current,
  set: (val) => emit('update:current', val),
});

const pageSize = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:page-size', val),
});

const pageSizes = computed(() => props.pageSizes ?? config.pagination?.pageSizes ?? [10, 20, 50, 100]);
const layout = computed(() => props.layout ?? config.pagination?.layout ?? 'total, sizes, prev, pager, next, jumper');

const onCurrentChange = (page: number) => {
  emit('update:current', page);
};

const onSizeChange = (size: number) => {
  emit('update:page-size', size);
};
</script>

<style scoped lang="scss">
.nv-pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  flex-shrink: 0;

  &__left {
    flex: 1;
  }
}
</style>
