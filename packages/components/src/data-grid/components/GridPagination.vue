<script setup lang="ts">
  defineProps<{
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
    showSizeChanger: boolean;
    pageSizeOptions: number[];
    showTotal?: (total: number) => string;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  }>();
</script>

<template>
  <div class="nv-grid__pagination">
    <span
      v-if="showTotal"
      class="nv-grid__pagination-total"
    >
      {{ showTotal(total) }}
    </span>

    <el-pagination
      :current-page="current"
      :page-size="pageSize"
      :page-sizes="pageSizeOptions"
      :total="total"
      layout="prev, pager, next, sizes"
      @current-change="onPageChange"
      @size-change="onPageSizeChange"
    />
  </div>
</template>
