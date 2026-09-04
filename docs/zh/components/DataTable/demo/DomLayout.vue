<template>
  <div>
    <h4>normal 模式（固定高度，内部滚动）</h4>
    <div style="height: 300px; border: 1px solid #eee; margin-bottom: 20px">
      <NDataTable
        :columns="columns"
        :data="tableData"
        dom-layout="normal"
        show-index
        stripe
      />
    </div>

    <h4>autoHeight 模式（高度随内容撑开）</h4>
    <div style="border: 1px solid #eee; padding: 10px">
      <NDataTable
        :columns="columns"
        :data="smallData"
        dom-layout="autoHeight"
        show-index
        stripe
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ColumnConfig, NDataTable } from '@nova-kits/components';

  interface Item {
    id: number;
    name: string;
    value: number;
  }

  const columns: ColumnConfig<Item>[] = [
    { prop: 'name', label: '名称', width: 150 },
    { prop: 'value', label: '数值', width: 100, align: 'center' },
  ];

  // 大量数据（触发滚动）
  const tableData: Item[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `项目 ${i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }));

  // 少量数据（高度撑开）
  const smallData: Item[] = [
    { id: 1, name: '项目 A', value: 100 },
    { id: 2, name: '项目 B', value: 200 },
    { id: 3, name: '项目 C', value: 300 },
  ];
</script>
