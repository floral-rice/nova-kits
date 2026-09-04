<template>
  <div style="height: 400px;">
    <NDataTable
      :columns="columns"
      :data="tableData"
      :actions="actions"
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
  status: 'active' | 'disabled';
  isAdmin: boolean;
}

const columns: ColumnConfig<User>[] = [
  { prop: 'name', label: '姓名', width: 120 },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    render: (row: User) => row.status === 'active' ? '启用' : '禁用',
  },
  {
    prop: 'isAdmin',
    label: '角色',
    width: 100,
    render: (row: User) => row.isAdmin ? '管理员' : '普通用户',
  },
];

const tableData: User[] = [
  { id: 1, name: '张三', status: 'active', isAdmin: true },
  { id: 2, name: '李四', status: 'disabled', isAdmin: false },
  { id: 3, name: '王五', status: 'active', isAdmin: false },
];

const actions: ActionConfig<User>[] = [
  {
    label: '编辑',
    onClick: (row: User) => console.log('编辑', row.id),
  },
  {
    label: '删除',
    onClick: (row: User) => console.log('删除', row.id),
    type: 'danger',
    // 禁用条件：禁用状态的用户不能删除
    disabled: (row: User) => row.status === 'disabled',
  },
  {
    label: '设为管理员',
    onClick: (row: User) => console.log('设为管理员', row.id),
    type: 'warning',
    // 禁用条件：已经是管理员的不能再设置
    disabled: (row: User) => row.isAdmin,
  },
];
</script>
