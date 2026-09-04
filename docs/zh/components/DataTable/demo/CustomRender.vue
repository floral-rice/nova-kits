<template>
  <div style="height: 400px">
    <NDataTable
      :columns="columns"
      :data="tableData"
      :actions="actions"
      show-index
      stripe
    >
      <!-- 插槽方式渲染 -->
      <template #avatar="{ row }">
        <el-avatar
          :size="32"
          :src="row.avatar"
        >
          {{ row.name.charAt(0) }}
        </el-avatar>
      </template>

      <template #tags="{ row }">
        <el-tag
          v-for="tag in row.tags"
          :key="tag"
          size="small"
          style="margin-right: 4px"
        >
          {{ tag }}
        </el-tag>
      </template>
    </NDataTable>
  </div>
</template>

<script setup lang="ts">
  import { h } from 'vue';
  import { ElProgress, ElSwitch } from 'element-plus';
  import { ColumnConfig, ActionConfig, NDataTable } from '@nova-kits/components';

  interface Product {
    id: number;
    name: string;
    avatar: string;
    price: number;
    stock: number;
    progress: number;
    status: boolean;
    tags: string[];
  }

  const columns: ColumnConfig<Product>[] = [
    // 插槽方式渲染
    { prop: 'avatar', label: '头像', width: 80, render: 'avatar', align: 'center' },

    // 默认渲染
    { prop: 'name', label: '商品名称', width: 120 },

    // VNode 函数渲染
    {
      prop: 'price',
      label: '价格',
      width: 100,
      render: (row: Product) =>
        h('span', { style: 'color: #f56c6c; font-weight: bold;' }, `¥${row.price}`),
    },

    // 返回值函数渲染
    {
      prop: 'stock',
      label: '库存',
      width: 100,
      render: (row: Product) => (row.stock > 0 ? `${row.stock} 件` : '已售罄'),
    },

    // 组件渲染（进度条）
    {
      prop: 'progress',
      label: '进度',
      width: 150,
      render: (row: Product) => h(ElProgress, { percentage: row.progress, strokeWidth: 8 }),
    },

    // 组件渲染（开关）
    {
      prop: 'status',
      label: '状态',
      width: 100,
      render: (row: Product) =>
        h(ElSwitch, {
          modelValue: row.status,
          onChange: (val: boolean | string | number) => {
            row.status = Boolean(val);
            console.log('状态变更:', row.id, val);
          },
        }),
    },

    // 插槽方式渲染（标签）
    { prop: 'tags', label: '标签', width: 200, render: 'tags' },
  ] satisfies ColumnConfig<Product>[];

  const actions: ActionConfig<Product>[] = [
    { label: '编辑', onClick: (row: Product) => console.log('编辑', row.id) },
    { label: '删除', onClick: (row: Product) => console.log('删除', row.id), type: 'danger' },
  ];

  const tableData: Product[] = [
    {
      id: 1,
      name: 'iPhone 15',
      avatar: '',
      price: 7999,
      stock: 100,
      progress: 75,
      status: true,
      tags: ['手机', '苹果'],
    },
    {
      id: 2,
      name: 'MacBook Pro',
      avatar: '',
      price: 14999,
      stock: 50,
      progress: 60,
      status: true,
      tags: ['电脑', '苹果'],
    },
    {
      id: 3,
      name: 'AirPods Pro',
      avatar: '',
      price: 1899,
      stock: 0,
      progress: 100,
      status: false,
      tags: ['耳机', '苹果'],
    },
    {
      id: 4,
      name: 'iPad Air',
      avatar: '',
      price: 4799,
      stock: 80,
      progress: 30,
      status: true,
      tags: ['平板', '苹果'],
    },
  ];
</script>
