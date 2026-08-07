import { ref, computed, watch } from 'vue';
import type { GridApi, SelectionChangedEvent } from 'ag-grid-community';
import type { DataGridProps } from '../typings';

export function useSelection<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  gridApi: () => GridApi<TData> | null
) {
  const selectedRowKeys = ref<string[]>(props.rowSelection?.selectedRowKeys || []);

  // 同步外部 selectedRowKeys
  watch(
    () => props.rowSelection?.selectedRowKeys,
    newKeys => {
      if (newKeys) {
        selectedRowKeys.value = newKeys;
        syncSelectionToGrid();
      }
    }
  );

  // 同步选择到 Grid
  function syncSelectionToGrid() {
    const api = gridApi();
    if (!api) return;

    api.forEachNode(node => {
      if (node.data) {
        const key = getRowKey(node.data);
        node.setSelected(selectedRowKeys.value.includes(key));
      }
    });
  }

  // 获取行 key
  function getRowKey(data: TData): string {
    if (typeof props.rowKey === 'function') {
      return props.rowKey(data);
    }
    return data[props.rowKey] || '';
  }

  // 选择变化处理
  function onSelectionChanged(_event: SelectionChangedEvent<TData>) {
    const api = gridApi();
    if (!api) return;

    const selectedRows = api.getSelectedRows();
    const keys = selectedRows.map(getRowKey);

    selectedRowKeys.value = keys;
    props.rowSelection?.onChange?.(keys, selectedRows as TData[]);
  }

  // 全选/取消全选
  function selectAll() {
    const api = gridApi();
    if (!api) return;
    api.selectAll();
  }

  function deselectAll() {
    const api = gridApi();
    if (!api) return;
    api.deselectAll();
  }

  // 已选行数据
  const selectedRows = computed(() => {
    const api = gridApi();
    if (!api) return [];
    return api.getSelectedRows() as TData[];
  });

  return {
    selectedRowKeys,
    selectedRows,
    onSelectionChanged,
    selectAll,
    deselectAll,
  };
}
