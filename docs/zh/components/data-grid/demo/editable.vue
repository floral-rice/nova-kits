<template>
  <div style="height: 300px">
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

  const data = ref([
    { id: 1, name: '张三', age: 25, status: 'active', date: '2024-01-01' },
    { id: 2, name: '李四', age: 30, status: 'disabled', date: '2024-01-02' },
    { id: 3, name: '王五', age: 28, status: 'active', date: '2024-01-03' },
  ]);

  const columns = [
    { title: '姓名', dataIndex: 'name' },
    {
      title: '年龄',
      dataIndex: 'age',
      editable: {
        renderer: 'number',
        params: { min: 0, max: 150 },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      editable: {
        renderer: 'select',
        params: {
          options: [
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'disabled' },
          ],
        },
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      editable: {
        renderer: 'date',
      },
    },
  ];
</script>
