<template>
  <div style="height: 400px">
    <NDataGrid
      :columns="columns"
      row-key="id"
      :fetch="fetchData"
      :pagination="true"
    />
  </div>
</template>

<script setup>
  import { NDataGrid } from '@nova-kits/components';
  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '邮箱', dataIndex: 'email' },
  ];

  // 模拟远程数据请求
  async function fetchData({ current, pageSize, sort: _sort }) {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 生成模拟数据
    const total = 1000;
    const start = (current - 1) * pageSize;
    const data = Array.from({ length: pageSize }, (_, i) => ({
      id: start + i + 1,
      name: `用户${start + i + 1}`,
      age: 20 + Math.floor(Math.random() * 30),
      email: `user${start + i + 1}@example.com`,
    }));

    return {
      data,
      total,
    };
  }
</script>
