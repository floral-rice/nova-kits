<script setup lang="ts">
  defineProps<{
    count: number;
    onClear: () => void;
  }>();
</script>

<template>
  <div
    v-if="count > 0"
    class="nv-grid__selected"
  >
    <span class="nv-grid__selected-text">已选择 {{ count }} 项</span>
    <el-button
      type="primary"
      link
      @click="onClear"
    >
      清空
    </el-button>
  </div>
</template>
