import { ref, computed } from 'vue';
import type { GridApi } from 'ag-grid-community';
import type { DataGridProps, DataGridSearch } from '../typings';

export function useSearch<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  gridApi: () => GridApi<TData> | null,
  _leafColumns?: () => any[]
) {
  const keyword = ref('');
  const matchNodes = ref<any[]>([]);
  const currentMatchIndex = ref(-1);

  // 搜索配置
  const searchConfig = computed<DataGridSearch | null>(() => {
    if (!props.showSearch) return null;
    if (typeof props.showSearch === 'boolean') return {};
    return props.showSearch;
  });

  // 执行搜索
  function search(text: string) {
    keyword.value = text;
    const api = gridApi();
    if (!api) return;

    if (!text) {
      api.setGridOption('quickFilterText', '');
      matchNodes.value = [];
      currentMatchIndex.value = -1;
      searchConfig.value?.onClear?.();
      return;
    }

    api.setGridOption('quickFilterText', text);

    const matches: any[] = [];
    api.forEachNodeAfterFilter(node => {
      if (node.data) {
        matches.push(node);
      }
    });

    matchNodes.value = matches;
    currentMatchIndex.value = matches.length > 0 ? 0 : -1;

    if (matches.length > 0) {
      scrollToMatch(0);
    }

    searchConfig.value?.onSearch?.(text);
  }

  // 跳转到指定匹配
  function scrollToMatch(index: number) {
    const api = gridApi();
    if (!api || index < 0 || index >= matchNodes.value.length) return;

    currentMatchIndex.value = index;
    const node = matchNodes.value[index];

    api.ensureIndexVisible(node.rowIndex, 'middle');
    node.setSelected(true);
  }

  // 上一个匹配
  function prevMatch() {
    if (matchNodes.value.length === 0) return;
    const newIndex =
      currentMatchIndex.value <= 0 ? matchNodes.value.length - 1 : currentMatchIndex.value - 1;
    scrollToMatch(newIndex);
  }

  // 下一个匹配
  function nextMatch() {
    if (matchNodes.value.length === 0) return;
    const newIndex =
      currentMatchIndex.value >= matchNodes.value.length - 1 ? 0 : currentMatchIndex.value + 1;
    scrollToMatch(newIndex);
  }

  // 清除搜索
  function clearSearch() {
    keyword.value = '';
    const api = gridApi();
    if (api) {
      api.setGridOption('quickFilterText', '');
    }
    matchNodes.value = [];
    currentMatchIndex.value = -1;
    searchConfig.value?.onClear?.();
  }

  return {
    keyword,
    matchNodes,
    currentMatchIndex,
    searchConfig,
    search,
    prevMatch,
    nextMatch,
    clearSearch,
  };
}
