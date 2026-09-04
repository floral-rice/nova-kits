<template>
  <div style="height: 400px">
    <NDataTable
      :columns="columns"
      :data="tableData"
      stripe
      border
    />
  </div>
</template>

<script setup lang="ts">
  import { ColumnConfig, NDataTable } from '@nova-kits/components';

  interface Student {
    id: number;
    name: string;
    chinese: number;
    math: number;
    english: number;
    physics: number;
    chemistry: number;
  }

  const columns: ColumnConfig<Student>[] = [
    { prop: 'name', label: '姓名', width: 100, fixed: 'left' },
    {
      label: '主科',
      children: [
        { prop: 'chinese', label: '语文', width: 80, align: 'center' },
        { prop: 'math', label: '数学', width: 80, align: 'center' },
        { prop: 'english', label: '英语', width: 80, align: 'center' },
      ],
    },
    {
      label: '理科',
      children: [
        { prop: 'physics', label: '物理', width: 80, align: 'center' },
        { prop: 'chemistry', label: '化学', width: 80, align: 'center' },
      ],
    },
  ];

  const tableData: Student[] = [
    { id: 1, name: '张三', chinese: 90, math: 85, english: 92, physics: 88, chemistry: 95 },
    { id: 2, name: '李四', chinese: 88, math: 92, english: 85, physics: 90, chemistry: 87 },
    { id: 3, name: '王五', chinese: 95, math: 78, english: 88, physics: 82, chemistry: 90 },
    { id: 4, name: '赵六', chinese: 82, math: 95, english: 90, physics: 93, chemistry: 88 },
    { id: 5, name: '孙七', chinese: 90, math: 88, english: 95, physics: 85, chemistry: 92 },
  ];
</script>
