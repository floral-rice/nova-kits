<template>
  <div>
    <ElButton :loading="loading" @click="run">
      点击提交（节流1秒）
    </ElButton>
    <div style="margin-top: 12px;">
      点击次数: {{ clickCount }}
    </div>
    <div style="margin-top: 12px;">
      请求次数: {{ requestCount }}
    </div>
    <div style="margin-top: 12px;">
      数据: {{ data ?? '无' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton } from 'element-plus';
import { useRequest } from '@nova-kits/hooks';

const clickCount = ref(0);
const requestCount = ref(0);

const { run, loading, data } = useRequest(
  () => {
    requestCount.value++;
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`请求完成 ${new Date().toLocaleTimeString()}`);
      }, 1000);
    });
  },
  {
    throttleInterval: 1000, // 1秒节流
    onSuccess() {
      clickCount.value++;
    },
  },
);
</script>
