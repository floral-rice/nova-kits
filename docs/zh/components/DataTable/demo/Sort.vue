<template>
  <div style="height: 400px">
    <h4>客户端排序（点击表头排序）</h4>
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
    score: number;
  }

  const columns: ColumnConfig<User>[] = [
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'age', label: '年龄', width: 100, align: 'center', sortable: true },
    { prop: 'score', label: '分数', width: 100, align: 'center', sortable: true },
  ];

  const tableData: User[] = [
    { id: 1, name: '张三', age: 28, score: 85 },
    { id: 2, name: '李四', age: 32, score: 92 },
    { id: 3, name: '王五', age: 25, score: 78 },
    { id: 4, name: '赵六', age: 35, score: 95 },
    { id: 5, name: '孙七', age: 29, score: 88 },
  ];
</script>
