<template>
  <div>
    <ElButton :loading="loading" @click="run">
      点击请求
    </ElButton>
    <div style="margin-top: 12px;">
      数据: {{ data ?? '无' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus';
import { useRequest } from '@nova-kits/hooks';

const { run, loading, data } = useRequest(
  () => {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Math.random() * 100);
      }, 1000);
    });
  },
  {
    onSuccess(res) {
      console.log('请求成功:', res);
    },
  },
);
</script>
