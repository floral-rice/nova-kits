<template>
  <div>
    <ElInput
      v-model="keyword"
      placeholder="输入搜索关键词"
      @input="onInput"
    />
    <div style="margin-top: 12px;">
      <ElTag v-if="loading" type="info">
        搜索中...
      </ElTag>
      <ElTag v-else-if="data" type="success">
        搜索完成
      </ElTag>
    </div>
    <div style="margin-top: 12px;">
      搜索结果: {{ data ?? '无' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElInput, ElTag } from 'element-plus';
import { useRequest } from '@nova-kits/hooks';

const keyword = ref('');

const { run, loading, data } = useRequest(
  (searchKeyword: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`搜索 "${searchKeyword}" 的结果`);
      }, 500);
    });
  },
  {
    debounceInterval: 500, // 500ms 防抖
    onSuccess(res) {
      console.log('搜索成功:', res);
    },
  },
);

const onInput = (value: string) => {
  if (value) {
    run(value);
  }
};
</script>
