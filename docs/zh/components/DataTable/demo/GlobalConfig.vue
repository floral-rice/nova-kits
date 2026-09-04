<template>
  <div>
    <p>在父组件中使用 <code>provideDataTableConfig</code> 设置全局默认配置</p>
    <p>
      当前配置：列宽 {{ config.defaultColumnWidth }}px，操作列宽 {{ config.defaultActionWidth }}px
    </p>

    <div style="height: 300px; margin-top: 16px">
      <NDataTable
        :columns="columns"
        :data="tableData"
        :actions="actions"
        show-index
        stripe
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ColumnConfig,
    ActionConfig,
    provideDataTableConfig,
    NDataTable,
  } from '@nova-kits/components';

  interface User {
    id: number;
    name: string;
    age: number;
    email: string;
  }

  // 全局配置（实际应用中在 App.vue 或布局组件中调用）
  const config = {
    defaultColumnWidth: 160,
    defaultActionWidth: 150,
  };

  provideDataTableConfig(config);

  const columns: ColumnConfig<User>[] = [
    { prop: 'name', label: '姓名' }, // 使用全局默认列宽 160
    { prop: 'age', label: '年龄', width: 80 }, // 覆盖为 80
    { prop: 'email', label: '邮箱' }, // 使用全局默认列宽 160
  ];

  const actions: ActionConfig<User>[] = [
    { label: '编辑', onClick: (row: User) => console.log('编辑', row.id) },
    { label: '删除', onClick: (row: User) => console.log('删除', row.id), type: 'danger' },
  ];

  const tableData: User[] = [
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com' },
    { id: 3, name: '王五', age: 25, email: 'wangwu@example.com' },
  ];
</script>
