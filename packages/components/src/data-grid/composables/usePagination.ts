import { ref, computed, watch } from 'vue';
import type { GridApi } from 'ag-grid-community';
import type { DataGridProps, PaginationType } from '../typings';

export function usePagination<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  gridApi: () => GridApi<TData> | null
) {
  const paginationConfig = computed<PaginationType>(() => {
    if (typeof props.pagination === 'boolean') {
      return props.pagination ? { current: 1, pageSize: 20 } : {};
    }
    return props.pagination || {};
  });

  const current = ref(paginationConfig.value.current || 1);
  const pageSize = ref(paginationConfig.value.pageSize || 20);
  const total = ref(0);

  // 监听数据源变化，自动更新总数（客户端分页）
  watch(
    () => props.dataSource,
    (newData) => {
      if (!props.fetch && newData) {
        total.value = newData.length;
      }
    },
    { immediate: true, deep: true }
  );

  // 客户端分页
  function goToPage(page: number) {
    const api = gridApi();
    if (!api) return;

    current.value = page;
    api.paginationGoToPage(page - 1);

    paginationConfig.value.onChange?.(page, pageSize.value);
  }

  function changePageSize(size: number) {
    const api = gridApi();
    if (!api) return;

    pageSize.value = size;
    current.value = 1;

    api.setGridOption('paginationPageSize', size);
    api.paginationGoToPage(0);

    paginationConfig.value.onChange?.(1, size);
  }

  // 设置总数（服务端分页用）
  function setTotal(value: number) {
    total.value = value;
  }

  // 总页数
  const totalPages = computed(() => {
    if (props.fetch) {
      return Math.ceil(total.value / pageSize.value);
    }
    const api = gridApi();
    if (!api) return 0;
    return api.paginationGetTotalPages();
  });

  // 分页信息
  const paginationInfo = computed(() => ({
    current: current.value,
    pageSize: pageSize.value,
    total: total.value,
    totalPages: totalPages.value,
    showSizeChanger: paginationConfig.value.showSizeChanger ?? true,
    pageSizeOptions: paginationConfig.value.pageSizeOptions || [10, 20, 50, 100],
    showTotal: paginationConfig.value.showTotal,
  }));

  return {
    current,
    pageSize,
    total,
    totalPages,
    paginationInfo,
    goToPage,
    changePageSize,
    setTotal,
  };
}
