<template>
  <div style="height: 400px">
    <NDataTable
      :columns="columns"
      :data="allData"
      :pagination="{ pageSize: 5 }"
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
    department: string;
  }

  const columns: ColumnConfig<User>[] = [
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'age', label: '年龄', width: 80, align: 'center' },
    { prop: 'department', label: '部门', minWidth: 150 },
  ];

  // 生成测试数据
  const allData: User[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    department: ['技术部', '产品部', '设计部', '市场部'][i % 4],
  }));
</script>
