<template>
  <div style="height: 300px">
    <NDataGrid
      :data-source="data"
      :columns="columns"
      row-key="id"
      :row-actions="rowActions"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { NDataGrid } from '@nova-kits/components';

  const data = ref([
    { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
    { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' },
  ]);

  const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '邮箱', dataIndex: 'email' },
  ];

  const rowActions = {
    maxVisible: 2,
    actions: [
      {
        label: '编辑',
        onClick: data => {
          console.log('编辑', data);
        },
      },
      {
        label: '删除',
        danger: true,
        confirm: '确定删除该记录吗？',
        onClick: data => {
          console.log('删除', data);
        },
      },
      {
        label: '查看详情',
        onClick: data => {
          console.log('查看详情', data);
        },
      },
    ],
  };
</script>
