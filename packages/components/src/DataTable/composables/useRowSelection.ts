import { ref, computed, watch } from 'vue';
import type { DataTableProps } from '../typing';

export function useRowSelection<T>(props: DataTableProps<T>) {
  /** 内部维护的选中 key 列表 */
  const internalSelectedKeys = ref<(string | number)[]>([]);

  /** 获取行的唯一标识 */
  const getRowKey = (row: T): string | number => {
    if (!props.rowKey) {
      return (row as any).id;
    }
    if (typeof props.rowKey === 'function') {
      return props.rowKey(row);
    }
    return (row as any)[props.rowKey];
  };

  /** 是否为单选模式 */
  const isRadio = computed(() => props.rowSelectActions?.type === 'radio');

  /** 监听外部 selectedKey 变化，同步到内部状态 */
  watch(
    () => props.rowSelectActions?.selectedKey,
    (newVal) => {
      if (newVal == null) {
        internalSelectedKeys.value = [];
      } else if (Array.isArray(newVal)) {
        internalSelectedKeys.value = [...newVal];
      } else {
        internalSelectedKeys.value = [newVal];
      }
    },
    { immediate: true }
  );

  /** 选择变化处理（checkbox 多选） */
  const handleSelectionChange = (selection: T[]) => {
    const keys = selection.map(getRowKey);
    internalSelectedKeys.value = keys;

    // 调用外部回调
    props.rowSelectActions?.onSelected?.(keys, selection);
  };

  /** Radio 单选变化处理 */
  const handleRadioChange = (row: T) => {
    const key = getRowKey(row);
    internalSelectedKeys.value = [key];

    // 调用外部回调
    props.rowSelectActions?.onSelected?.([key], [row]);
  };

  /** 判断行是否选中 */
  const isRowSelected = (row: T): boolean => {
    const key = getRowKey(row);
    return internalSelectedKeys.value.includes(key);
  };

  return {
    internalSelectedKeys,
    handleSelectionChange,
    handleRadioChange,
    getRowKey,
    isRowSelected,
    isRadio,
  };
}
