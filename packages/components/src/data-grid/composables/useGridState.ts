import { ref, onUnmounted, watch, type Ref } from 'vue';
import type { GridApi, GridReadyEvent } from 'ag-grid-community';
import type { DataGridProps } from '../typings';

interface UseGridStateReturn<TData> {
  gridApi: Ref<GridApi<TData> | null>;
  onGridReady: (event: GridReadyEvent<TData>) => void;
}

export function useGridState<TData extends Record<string, any>>(
  props: DataGridProps<TData>
): UseGridStateReturn<TData> {
  const gridApi = ref<GridApi<TData> | null>(null) as Ref<GridApi<TData> | null>;

  function onGridReady(event: GridReadyEvent<TData>) {
    gridApi.value = event.api;
  }

  // 监听 dataSource 变化
  watch(
    () => props.dataSource,
    newData => {
      if (gridApi.value && newData) {
        gridApi.value.setGridOption('rowData', newData);
      }
    },
    { deep: true }
  );

  // 资源清理
  onUnmounted(() => {
    gridApi.value?.destroy();
  });

  return {
    gridApi,
    onGridReady,
  };
}
