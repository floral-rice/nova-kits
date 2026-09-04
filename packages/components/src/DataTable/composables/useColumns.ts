import { computed } from 'vue';
import type { ColumnConfig } from '../typing';
import { useDataTableConfig } from './useDataTableConfig';

export function useColumns<T>(columns: ColumnConfig<T>[]) {
  const config = useDataTableConfig();

  /** 计算表头最大层级 */
  const maxLevel = computed(() => {
    const getLevel = (cols: ColumnConfig<T>[], level: number): number => {
      const levels = cols.map(col =>
        col.children?.length ? getLevel(col.children, level + 1) : level
      );
      return Math.max(...levels, level);
    };
    return getLevel(columns, 0);
  });

  /** 获取列的实际宽度（优先使用列配置，其次全局配置） */
  const getColumnWidth = (column: ColumnConfig<T>): number | string | undefined => {
    return column.width ?? config.defaultColumnWidth;
  };

  /** 判断是否为叶子列（无 children） */
  const isLeafColumn = (column: ColumnConfig<T>): boolean => {
    return !column.children || column.children.length === 0;
  };

  /** 获取所有叶子列（用于计算 colspan） */
  const getLeafCount = (column: ColumnConfig<T>): number => {
    if (isLeafColumn(column)) return 1;
    return column.children!.reduce((sum, child) => sum + getLeafCount(child), 0);
  };

  return {
    maxLevel,
    getColumnWidth,
    isLeafColumn,
    getLeafCount,
  };
}
