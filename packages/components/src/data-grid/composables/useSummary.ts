import { computed, watch } from 'vue';
import type { GridApi } from 'ag-grid-community';
import type { DataGridProps, SummaryType } from '../typings';
import { calcSummary } from '../utils/summary';
import { DataGridSummaryFlag } from '../constants';

export function useSummary<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  gridApi: () => GridApi<TData> | null,
  data: () => TData[]
) {
  // 汇总配置
  const summaryConfig = computed<SummaryType | null>(() => {
    if (!props.summary) return null;
    if (Array.isArray(props.summary)) return null; // 静态汇总行
    return props.summary as SummaryType;
  });

  // 静态汇总行
  const staticSummary = computed(() => {
    if (!props.summary || !Array.isArray(props.summary)) return null;
    return props.summary as Record<string, any>[];
  });

  // 计算汇总行
  const calculatedSummary = computed(() => {
    if (!summaryConfig.value) return null;
    const result = calcSummary(data(), summaryConfig.value);
    return { ...result, [DataGridSummaryFlag]: true };
  });

  // 汇总行数据
  const summaryRows = computed(() => {
    if (staticSummary.value) {
      return staticSummary.value.map(row => ({
        ...row,
        [DataGridSummaryFlag]: true,
      }));
    }
    if (calculatedSummary.value) {
      return [calculatedSummary.value];
    }
    return [];
  });

  // 更新 pinnedBottomRowData
  watch(
    summaryRows,
    rows => {
      const api = gridApi();
      if (api) {
        api.setGridOption('pinnedBottomRowData', rows);
      }
    },
    { immediate: true }
  );

  return {
    summaryRows,
    calculatedSummary,
  };
}
