<template>
  <!-- 分组列 -->
  <el-table-column
    v-if="column.children?.length"
    :label="column.label"
  >
    <DataTableColumnNode
      v-for="child in column.children"
      :key="child.prop || child.label"
      :column="child"
      :max-level="maxLevel"
    />
  </el-table-column>

  <!-- 普通列 -->
  <el-table-column
    v-else
    :prop="column.prop"
    :label="column.label"
    :width="columnWidth"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :sortable="column.sortable"
    :align="column.align || 'left'"
    :show-overflow-tooltip="column.showOverflowTooltip ?? true"
  >
    <template #default="{ row, $index }">
      <!-- render 为函数 -->
      <template v-if="typeof column.render === 'function'">
        <template v-if="isVNodeResult(row as T, $index)">
          <component :is="callRender(row as T, $index)" />
        </template>
        <template v-else>
          {{ callRender(row as T, $index) }}
        </template>
      </template>

      <!-- render 为插槽名 -->
      <slot
        v-else-if="typeof column.render === 'string'"
        :name="column.render"
        :row="row"
        :index="$index"
      />

      <!-- render 为组件 -->
      <component
        :is="column.render"
        v-else-if="column.render && typeof column.render === 'object'"
        v-bind="getComponentProps(row as T, $index)"
      />

      <!-- 默认：直接显示字段值 -->
      <template v-else>
        {{ column.prop ? row[column.prop] : '' }}
      </template>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { defineAsyncComponent, type Component } from 'vue';

// 在 setup 外部定义异步组件，避免循环类型推断
const DataTableColumnNode: Component = defineAsyncComponent(
  () => import('./DataTableColumn.vue') as Promise<{ default: Component }>
);

export default {
  name: 'DataTableColumn',
};
</script>

<script setup lang="ts" generic="T">
import { computed, isVNode, type VNode } from 'vue';
import type { ColumnConfig } from '../typing';
import { useDataTableConfig } from '../composables/useDataTableConfig';

const props = defineProps<{
  column: ColumnConfig<T>;
  maxLevel: number;
}>();

const config = useDataTableConfig();

/** 列宽度（优先使用列配置，其次全局配置） */
const columnWidth = computed(() => {
  return props.column.width ?? config.defaultColumnWidth;
});

/** 调用 render 函数 */
const callRender = (row: T, index: number): VNode | string | number | undefined => {
  const { render } = props.column;
  if (typeof render === 'function') {
    return (render as (row: T, index: number) => VNode | string | number)(row, index);
  }
  return undefined;
};

/** 判断 render 返回值是否为 VNode */
const isVNodeResult = (row: T, index: number): boolean => {
  const result = callRender(row, index);
  return result !== undefined && isVNode(result);
};

/** 获取组件 props */
const getComponentProps = (row: T, index: number) => {
  const { renderProps } = props.column;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const value = props.column.prop != null ? row[props.column.prop] : undefined;
  return {
    ...renderProps,
    row,
    index,
    value,
  };
};
</script>
