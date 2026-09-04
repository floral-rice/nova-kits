<template>
  <div style="height: 400px">
    <NDataTable
      ref="tableRef"
      :columns="columns"
      :fetch-page="fetchUsers"
      :actions="actions"
      show-index
      auto-load
      stripe
    >
      <template #status="{ row }">
        <el-tag
          :type="row.status === 'active' ? 'success' : 'danger'"
          size="small"
        >
          {{ row.status === 'active' ? '活跃' : '禁用' }}
        </el-tag>
      </template>

      <template #pagination-left>
        <span style="color: #999; font-size: 13px">共 {{ total }} 条数据</span>
      </template>
    </NDataTable>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import {
    ColumnConfig,
    ActionConfig,
    FetchPageParams,
    FetchPageResult,
    NDataTable,
  } from '@nova-kits/components';

  interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'disabled';
    createTime: string;
  }

  const tableRef = ref();
  const total = ref(0);

  const columns: ColumnConfig<User>[] = [
    { prop: 'name', label: '姓名', width: 120 },
    { prop: 'email', label: '邮箱', minWidth: 200 },
    { prop: 'status', label: '状态', width: 100, render: 'status', align: 'center' },
    { prop: 'createTime', label: '创建时间', width: 180 },
  ];

  const actions: ActionConfig<User>[] = [
    { label: '编辑', onClick: (row: User) => console.log('编辑', row.id) },
    { label: '查看', onClick: (row: User) => console.log('查看', row.id), type: 'success' },
    { label: '删除', onClick: (row: User) => console.log('删除', row.id), type: 'danger' },
    { label: '导出', onClick: (row: User) => console.log('导出', row.id) },
  ];

  // 模拟远程分页
  const fetchUsers = async (params: FetchPageParams): Promise<FetchPageResult<User>> => {
    console.log('请求参数:', params);

    // 模拟接口延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    // 模拟数据
    const allUsers: User[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `用户${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 3 === 0 ? 'disabled' : 'active',
      createTime: `2024-01-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
    }));

    // 处理排序
    let sorted = [...allUsers];
    if (params.order) {
      sorted.sort((a, b) => {
        const aVal = a[params.order!.prop as keyof User];
        const bVal = b[params.order!.prop as keyof User];
        const compare = String(aVal).localeCompare(String(bVal));
        return params.order!.order === 'ascending' ? compare : -compare;
      });
    }

    // 分页
    const start = (params.current - 1) * params.pageSize;
    const content = sorted.slice(start, start + params.pageSize);

    total.value = allUsers.length;

    return {
      total: allUsers.length,
      content,
    };
  };
</script>
