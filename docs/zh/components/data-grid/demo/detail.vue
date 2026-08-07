<template>
  <NDataGrid
    :data-source="data"
    :columns="columns"
    row-key="id"
    :detail-cell="{ render: renderDetail }"
  />
</template>

<script setup>
  import { ref, h } from 'vue';
  import { NDataGrid } from '@nova-kits/components';

  const data = ref([
    { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', address: '北京市朝阳区' },
    { id: 2, name: '李四', age: 30, email: 'lisi@example.com', address: '上海市浦东新区' },
    { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', address: '广州市天河区' },
  ]);

  const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '邮箱', dataIndex: 'email' },
  ];

  function renderDetail(data, _rowIndex) {
    return h('div', { style: { padding: '16px' } }, [
      h('p', null, `姓名：${data.name}`),
      h('p', null, `年龄：${data.age}`),
      h('p', null, `邮箱：${data.email}`),
      h('p', null, `地址：${data.address}`),
    ]);
  }
</script>
