import { ref } from 'vue';
import type { GridApi } from 'ag-grid-community';
import type { DataGridProps } from '../typings';

export function useDetailCell<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  gridApi: () => GridApi<TData> | null
) {
  // 展开的行
  const expandedRowKeys = ref<Set<string>>(new Set());

  // 获取行 key
  function getRowKey(data: TData): string {
    if (typeof props.rowKey === 'function') {
      return props.rowKey(data);
    }
    return data[props.rowKey] || '';
  }

  // 判断是否可展开
  function isExpandable(data: TData): boolean {
    if (!props.detailCell) return false;
    if (props.detailCell.getExpandable) {
      return props.detailCell.getExpandable(data);
    }
    return true;
  }

  // 展开行
  function expandRow(data: TData) {
    const key = getRowKey(data);
    expandedRowKeys.value.add(key);
    updateGridDetailRow();
  }

  // 收起行
  function collapseRow(data: TData) {
    const key = getRowKey(data);
    expandedRowKeys.value.delete(key);
    updateGridDetailRow();
  }

  // 切换展开/收起
  function toggleRow(data: TData) {
    const key = getRowKey(data);
    if (expandedRowKeys.value.has(key)) {
      collapseRow(data);
    } else {
      expandRow(data);
    }
  }

  // 判断是否展开
  function isExpanded(data: TData): boolean {
    const key = getRowKey(data);
    return expandedRowKeys.value.has(key);
  }

  // 更新 Grid 的 masterDetail 设置
  function updateGridDetailRow() {
    const api = gridApi();
    if (!api) return;

    api.refreshCells({
      force: true,
    });
  }

  // 全部展开
  function expandAll() {
    const api = gridApi();
    if (!api) return;

    api.forEachNode(node => {
      if (node.data && isExpandable(node.data)) {
        expandedRowKeys.value.add(getRowKey(node.data));
      }
    });
    updateGridDetailRow();
  }

  // 全部收起
  function collapseAll() {
    expandedRowKeys.value.clear();
    updateGridDetailRow();
  }

  return {
    expandedRowKeys,
    isExpandable,
    expandRow,
    collapseRow,
    toggleRow,
    isExpanded,
    expandAll,
    collapseAll,
  };
}
