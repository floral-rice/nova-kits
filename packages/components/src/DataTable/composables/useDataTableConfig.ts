import { type InjectionKey, inject, provide } from 'vue';
import type { DataTableConfig } from '../typing';

export const DATA_TABLE_CONFIG_KEY: InjectionKey<DataTableConfig> = Symbol('data-table-config');

const defaultConfig: Required<DataTableConfig> = {
  defaultColumnWidth: 140,
  defaultActionWidth: 120,
  pagination: {
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
};

/**
 * 提供 DataTable 全局配置
 * 在应用根组件或布局组件中调用
 */
export function provideDataTableConfig(config: DataTableConfig) {
  provide(DATA_TABLE_CONFIG_KEY, {
    ...defaultConfig,
    ...config,
    pagination: {
      ...defaultConfig.pagination,
      ...config.pagination,
    },
  });
}

/**
 * 注入 DataTable 全局配置
 * 组件内部使用，props 优先级高于全局配置
 */
export function useDataTableConfig() {
  return inject(DATA_TABLE_CONFIG_KEY, defaultConfig);
}
