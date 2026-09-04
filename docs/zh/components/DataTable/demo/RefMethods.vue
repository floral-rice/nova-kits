<template>
  <div>
    <div style="margin-bottom: 16px">
      <el-button
        type="primary"
        @click="handleFetch"
      >
        手动加载
      </el-button>
      <el-button @click="handleRefresh">
        刷新当前页
      </el-button>
      <el-button @click="handleGetData">
        获取当前数据
      </el-button>
    </div>

    <div style="height: 400px">
      <NDataTable
        ref="tableRef"
        :columns="columns"
        :fetch-page="fetchData"
        show-index
        stripe
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import {
    ColumnConfig,
    FetchPageParams,
    FetchPageResult,
    DataTableExpose,
    NDataTable,
  } from '@nova-kits/components';

  interface Item {
    id: number;
    name: string;
    value: number;
  }

  const tableRef = ref<DataTableExpose<Item>>();

  const columns: ColumnConfig<Item>[] = [
    { prop: 'name', label: '名称', width: 150 },
    { prop: 'value', label: '数值', width: 100, align: 'center' },
  ];

  // 模拟远程数据
  const fetchData = async (params: FetchPageParams): Promise<FetchPageResult<Item>> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allData: Item[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `项目 ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
    }));

    const start = (params.current - 1) * params.pageSize;
    return {
      total: allData.length,
      content: allData.slice(start, start + params.pageSize),
    };
  };

  // 手动触发加载
  const handleFetch = () => {
    void tableRef.value?.fetch();
  };

  // 刷新当前页
  const handleRefresh = () => {
    void tableRef.value?.refresh();
    ElMessage.success('已刷新');
  };

  // 获取当前数据
  const handleGetData = () => {
    const data = tableRef.value?.data;
    ElMessage.info(`当前有 ${data?.length ?? 0} 条数据`);
  };
</script>
