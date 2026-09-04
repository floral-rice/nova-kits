<template>
  <div style="height: 400px">
    <h4>基础操作列（3个按钮）</h4>
    <NDataTable
      :columns="columns"
      :data="tableData"
      :actions="basicActions"
      show-index
      stripe
      style="margin-bottom: 20px"
    />

    <h4>操作列折叠（maxActionCount=2）</h4>
    <NDataTable
      :columns="columns"
      :data="tableData"
      :actions="moreActions"
      :max-action-count="2"
      show-index
      stripe
    />
  </div>
</template>

<script setup lang="ts">
  import { ColumnConfig, ActionConfig, NDataTable } from '@nova-kits/components';

  interface User {
    id: number;
    name: string;
    age: number;
    status: 'active' | 'disabled';
  }

  const columns: ColumnConfig<User>[] = [
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'age', label: '年龄', width: 80, align: 'center' },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      render: (row: User) => (row.status === 'active' ? '启用' : '禁用'),
    },
  ];

  const tableData: User[] = [
    { id: 1, name: '张三', age: 28, status: 'active' },
    { id: 2, name: '李四', age: 32, status: 'disabled' },
    { id: 3, name: '王五', age: 25, status: 'active' },
  ];

  // 基础操作列（3个按钮）
  const basicActions: ActionConfig<User>[] = [
    { label: '编辑', onClick: (row: User) => console.log('编辑', row.id) },
    { label: '查看', onClick: (row: User) => console.log('查看', row.id), type: 'success' },
    { label: '删除', onClick: (row: User) => console.log('删除', row.id), type: 'danger' },
  ];

  // 更多操作（超过 maxActionCount 会折叠到"更多"）
  const moreActions: ActionConfig<User>[] = [
    { label: '编辑', onClick: (row: User) => console.log('编辑', row.id) },
    { label: '查看', onClick: (row: User) => console.log('查看', row.id), type: 'success' },
    { label: '删除', onClick: (row: User) => console.log('删除', row.id), type: 'danger' },
    { label: '导出', onClick: (row: User) => console.log('导出', row.id) },
    { label: '打印', onClick: (row: User) => console.log('打印', row.id) },
  ];
</script>
