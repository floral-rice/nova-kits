import { ref, computed, shallowRef } from 'vue';
import type { DataTableProps, FetchPageParams, OrderType } from '../typing';
import { useDataTableConfig } from './useDataTableConfig';

export function usePagination<T>(props: DataTableProps<T>) {
  const config = useDataTableConfig();

  const current = ref(1);
  const pageSize = ref(config.pagination?.pageSize ?? 20);
  const total = ref(0);
  const dataSource = shallowRef<T[]>([]);
  const loading = ref(false);
  const currentOrder = ref<{ prop: string; order: OrderType }>();

  /** 是否远程分页 */
  const isRemote = computed(() => !!props.fetchPage);

  /** 是否显示分页器（远程分页强制显示） */
  const showPagination = computed(() => {
    if (isRemote.value) return true;
    if (props.pagination === false) return false;
    return !!props.pagination || !!props.data;
  });

  /** 客户端分页后的数据 */
  const displayData = computed<T[]>(() => {
    if (isRemote.value || props.pagination === false) {
      return dataSource.value;
    }
    const start = (current.value - 1) * pageSize.value;
    return dataSource.value.slice(start, start + pageSize.value);
  });

  /** 核心：fetchPage */
  const fetchPage = async () => {
    if (isRemote.value) {
      loading.value = true;
      try {
        const params: FetchPageParams = {
          current: current.value,
          pageSize: pageSize.value,
        };
        if (currentOrder.value) {
          params.order = currentOrder.value;
        }
        const result = await props.fetchPage!(params);
        dataSource.value = result.content;
        total.value = result.total;
      } finally {
        loading.value = false;
      }
    } else {
      // 客户端：data 直接赋值
      dataSource.value = props.data || [];
      total.value = props.data?.length || 0;
    }
  };

  /** 排序处理（远程分页直接触发 fetchPage） */
  const handleSortChange = ({ prop, order }: { prop: string; order: OrderType | null }) => {
    if (isRemote.value) {
      currentOrder.value = order ? { prop, order } : undefined;
      fetchPage();
    }
  };

  /** 刷新当前页 */
  const refresh = async () => {
    await fetchPage();
  };

  /** 页码变化 */
  const handlePageChange = (page: number) => {
    current.value = page;
    fetchPage();
  };

  /** 每页条数变化 */
  const handleSizeChange = (size: number) => {
    pageSize.value = size;
    current.value = 1;
    fetchPage();
  };

  return {
    current,
    pageSize,
    total,
    dataSource,
    loading,
    displayData,
    showPagination,
    isRemote,
    fetchPage,
    refresh,
    handleSortChange,
    handlePageChange,
    handleSizeChange,
  };
}
