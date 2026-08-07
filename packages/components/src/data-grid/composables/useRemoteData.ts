import { ref, watch, onMounted } from 'vue';
import type { GridApi, SortChangedEvent } from 'ag-grid-community';
import type { DataGridProps, SortType, FetchParams } from '../typings';

export function useRemoteData<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  gridApi: () => GridApi<TData> | null,
  pagination: { current: any; pageSize: any; setTotal: (v: number) => void }
) {
  const loading = ref(false);
  const data = ref<TData[]>([]);
  const summary = ref<any>(null);
  const extra = ref<any>(null);

  // 请求 ID，用于竞态处理
  let fetchId = 0;

  // 执行 fetch
  async function fetch(page?: number) {
    if (!props.fetch) return;

    const currentFetchId = ++fetchId;
    loading.value = true;

    try {
      const sort = getSortInfo();

      const params: FetchParams = {
        current: page || pagination.current.value,
        pageSize: pagination.pageSize.value,
        sort,
      };

      const result = await props.fetch(params);

      if (currentFetchId !== fetchId) return;

      data.value = result.data;
      summary.value = result.summary;
      extra.value = result.extra;

      if (result.total !== undefined) {
        pagination.setTotal(result.total);
      }

      const api = gridApi();
      if (api) {
        api.setGridOption('rowData', result.data);
      }
    } catch (error) {
      if (currentFetchId !== fetchId) return;
      console.error('DataGrid fetch error:', error);
    } finally {
      if (currentFetchId === fetchId) {
        loading.value = false;
      }
    }
  }

  // 获取排序信息
  function getSortInfo(): SortType[] {
    const api = gridApi();
    if (!api) return [];

    const sortModel: SortType[] = [];
    const columns = api.getColumns();
    if (columns) {
      columns.forEach(col => {
        const sort = col.getSort();
        if (sort) {
          sortModel.push({
            field: col.getColId(),
            order: sort as 'asc' | 'desc',
          });
        }
      });
    }

    return sortModel;
  }

  // 排序变化时重新请求
  function onSortChanged(_event: SortChangedEvent) {
    if (props.fetch) {
      fetch(1);
    }
  }

  // 刷新
  function refresh() {
    fetch();
  }

  // 自动加载
  onMounted(() => {
    if (props.fetch && props.autoLoad !== false) {
      fetch();
    }
  });

  // 监听 pagination 变化
  watch(
    () => [pagination.current.value, pagination.pageSize.value],
    () => {
      if (props.fetch) {
        fetch();
      }
    }
  );

  return {
    loading,
    data,
    summary,
    extra,
    fetch,
    refresh,
    onSortChanged,
  };
}
