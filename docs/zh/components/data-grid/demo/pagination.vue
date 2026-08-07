<template>
  <div style="height: 400px">
    <NDataGrid
      :data-source="data"
      :columns="columns"
      row-key="id"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { NDataGrid } from '@nova-kits/components';

  // 生成测试数据
  const data = ref(
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `用户${i + 1}`,
      age: 20 + Math.floor(Math.random() * 30),
      email: `user${i + 1}@example.com`,
    }))
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '邮箱', dataIndex: 'email' },
  ];
</script>
