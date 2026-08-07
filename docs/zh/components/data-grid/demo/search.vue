<template>
  <div style="height: 300px">
    <NDataGrid
      :data-source="data"
      :columns="columns"
      row-key="id"
      :show-search="true"
    />
  </div>
</template>

<script setup>
  import { NDataGrid } from '@nova-kits/components';
  import { ref } from 'vue';

  const data = ref([
    { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
    { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' },
    { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com' },
    { id: 5, name: '钱七', age: 22, email: 'qianqi@example.com' },
  ]);

  const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '邮箱', dataIndex: 'email' },
  ];
</script>
