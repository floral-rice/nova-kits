<template>
  <div style="height: 400px">
    <NDataTable
      :columns="columns"
      :data="tableData"
      show-index
      stripe
    />
  </div>
</template>

<script setup lang="ts">
  import { ColumnConfig, NDataTable } from '@nova-kits/components';

  interface User {
    id: number;
    name: string;
    age: number;
    email: string;
    address: string;
  }

  const columns: ColumnConfig<User>[] = [
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'age', label: '年龄', width: 80, align: 'center' },
    { prop: 'email', label: '邮箱', minWidth: 200 },
    { prop: 'address', label: '地址', minWidth: 200 },
  ];

  const tableData: User[] = [
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', address: '北京市朝阳区' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com', address: '上海市浦东新区' },
    { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', address: '广州市天河区' },
    { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', address: '深圳市南山区' },
    { id: 5, name: '孙七', age: 29, email: 'sunqi@example.com', address: '杭州市西湖区' },
  ];
</script>
