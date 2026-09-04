<template>
  <div
    ref="wrapperRef"
    class="nv-data-table"
    :class="[
      props.class,
      { 'nv-data-table--auto-height': domLayout === 'autoHeight' }
    ]"
    :style="props.style"
  >
    <el-table
      ref="tableRef"
      v-loading="!hasExternalLoading && loading"
      :data="displayData"
      :height="tableHeight"
      :stripe="props.stripe"
      :border="props.border"
      style="min-width: 0"
      @sort-change="handleSortChange"
      @row-click="(row: any, col: any, e: Event) => emit('row-click', row, col, e)"
      @selection-change="handleSelectionChange"
    >
      <!-- 选择列（checkbox） -->
      <el-table-column
        v-if="rowSelectActions && !isRadio"
        type="selection"
        width="55"
        fixed="left"
      />

      <!-- 单选列（radio）- el-table-column 不支持 type="radio"，使用自定义模板 -->
      <el-table-column
        v-if="rowSelectActions && isRadio"
        width="55"
        fixed="left"
        align="center"
      >
        <template #default="{ row }">
          <el-radio
            :model-value="getRadioValue(row)"
            :value="true"
            @change="handleRadioChange(row)"
          >
&nbsp;
          </el-radio>
        </template>
      </el-table-column>

      <!-- 序号列 -->
      <el-table-column
        v-if="props.showIndex"
        type="index"
        label="序号"
        :width="props.indexWidth || 60"
        fixed="left"
        align="center"
      />

      <!-- 动态列 -->
      <DataTableColumn
        v-for="col in props.columns"
        :key="col.prop || col.label"
        :column="col"
        :max-level="maxLevel"
      >
        <!-- 透传所有插槽 -->
        <template
          v-for="slot in slotNames"
          #[slot]="slotProps"
        >
          <slot
            :name="slot"
            v-bind="slotProps"
          />
        </template>
      </DataTableColumn>

      <!-- 操作列 -->
      <el-table-column
        v-if="props.actions?.length"
        label="操作"
        fixed="right"
        :width="computedActionWidth"
      >
        <template #default="{ row }">
          <ActionButtons
            :row="row"
            :visible-actions="visibleActions"
            :more-actions="moreActions"
            :is-disabled="isDisabled"
          />
        </template>
      </el-table-column>

      <!-- 空状态插槽 -->
      <template #empty>
        <slot name="empty">
          <span>{{ props.emptyText || '暂无数据' }}</span>
        </slot>
      </template>
    </el-table>

    <!-- 分页区域 -->
    <PaginationBar
      v-if="showPagination"
      :current="current"
      :page-size="pageSize"
      :total="total"
      @update:current="handlePageChange"
      @update:page-size="handleSizeChange"
    >
      <template #left>
        <slot name="pagination-left" />
      </template>
    </PaginationBar>
  </div>
</template>

<script setup lang="ts" generic="T">
  import { computed, onMounted, watch, ref, useSlots } from 'vue';
  import { usePagination } from './composables/usePagination';
  import { useColumns } from './composables/useColumns';
  import { useActions } from './composables/useActions';
  import { useLoading } from './composables/useLoading';
  import { useRowSelection } from './composables/useRowSelection';
  import { useTableHeight } from './composables/useTableHeight';
  import DataTableColumn from './components/DataTableColumn.vue';
  import ActionButtons from './components/ActionButtons.vue';
  import PaginationBar from './components/PaginationBar.vue';
  import type { DataTableProps, DataTableExpose } from './typing';

  const props = withDefaults(defineProps<DataTableProps<T>>(), {
    pagination: true,
    autoLoad: false,
    showIndex: false,
    maxActionCount: 3,
    domLayout: 'normal',
    stripe: true,
    border: false,
    emptyText: '暂无数据',
    indexWidth: 60,
    rowKey: 'id',
  });

  const emit = defineEmits<{
    'update:loading': [value: boolean];
    'row-click': [row: T, column: any, event: Event];
  }>();

  const slots = useSlots();

  // ============ 表格高度 ============
  const wrapperRef = ref<HTMLDivElement>();
  const { tableHeight } = useTableHeight(props, wrapperRef);

  // ============ 行选择 ============
  const {
    internalSelectedKeys,
    handleSelectionChange,
    handleRadioChange,
    getRowKey,
    isRowSelected,
    isRadio,
  } = useRowSelection<T>(props);

  /** 获取 radio 的 model-value（当前行是否选中） */
  const getRadioValue = (row: T): boolean => {
    return isRowSelected(row);
  };

  /** 获取所有插槽名称（用于透传） */
  const slotNames = computed(() => {
    return Object.keys(slots).filter(name => !['empty', 'pagination-left'].includes(name));
  });

  // ============ Composables ============

  const {
    current,
    pageSize,
    total,
    loading,
    displayData,
    showPagination,
    isRemote,
    fetchPage,
    refresh,
    handleSortChange,
    handlePageChange,
    handleSizeChange,
  } = usePagination<T>(props);

  const { maxLevel } = useColumns<T>(props.columns);

  const { visibleActions, moreActions, computedActionWidth, isDisabled } = useActions<T>(
    props.actions || [],
    props.maxActionCount,
    props.actionWidth
  );

  const { hasExternalLoading } = useLoading(emit, loading);

  // ============ 生命周期 ============

  // 初始化加载数据
  onMounted(() => {
    // 客户端数据：始终加载
    // 远程数据：autoLoad 为 true 时自动加载
    if (!isRemote.value || props.autoLoad) {
      fetchPage();
    }
  });

  // 客户端数据变化时更新
  watch(
    () => props.data,
    () => {
      if (!isRemote.value) {
        fetchPage();
      }
    },
    { deep: true }
  );

  // ============ 导出 ============

  defineExpose<DataTableExpose<T>>({
    fetch: fetchPage,
    refresh,
    data: displayData.value,
    loading: loading.value,
  });
</script>

<style scoped lang="scss">
  .nv-data-table {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    // autoHeight 模式：高度随内容撑开
    &--auto-height {
      height: auto;
      overflow: visible;

      :deep(.el-table) {
        min-height: 200px;
      }
    }
  }
</style>
