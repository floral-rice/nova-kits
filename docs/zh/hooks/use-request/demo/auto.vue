<template>
  <div>
    <div>页面加载时自动请求数据</div>
    <div style="margin-top: 12px">
      <ElTag v-if="loading" type="info">
        加载中...
      </ElTag>
      <ElTag v-else type="success">
        加载完成
      </ElTag>
    </div>
    <div style="margin-top: 12px">
      数据: {{ data ?? '无' }}
    </div>
    <ElButton style="margin-top: 12px" @click="run">
      刷新
    </ElButton>
  </div>
</template>

<script setup lang="ts">
import { ElButton, ElTag } from 'element-plus';
import { useRequest } from '@nova-kits/hooks';

const { run, loading, data } = useRequest(
  () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`自动请求的数据 ${new Date().toLocaleTimeString()}`);
      }, 1500);
    });
  },
  {
    manual: false, // 自动执行
  },
);
</script>
