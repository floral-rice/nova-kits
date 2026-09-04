import { ref, onMounted, onBeforeUnmount, watch, type Ref } from 'vue';
import type { DataTableProps } from '../typing';

export function useTableHeight(
  props: DataTableProps,
  wrapperRef: Ref<HTMLElement | undefined>
) {
  /** 表格高度 */
  const tableHeight = ref<number>();

  let resizeObserver: ResizeObserver | undefined;

  /** 更新高度 */
  const updateHeight = () => {
    if (!wrapperRef.value) return;

    if (props.domLayout === 'autoHeight') {
      // autoHeight 模式：不设置高度，由内容撑开
      tableHeight.value = undefined;
    } else {
      // normal 模式：使用父容器高度
      const parent = wrapperRef.value.parentElement;
      if (parent) {
        tableHeight.value = parent.clientHeight;
      }
    }
  };

  onMounted(() => {
    // 创建 ResizeObserver 监听父容器大小变化
    resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    // 监听 wrapper 元素的父容器
    if (wrapperRef.value?.parentElement) {
      resizeObserver.observe(wrapperRef.value.parentElement);
    }

    // 初始更新
    updateHeight();
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  // 监听 domLayout 变化
  watch(
    () => props.domLayout,
    () => {
      updateHeight();
    }
  );

  return {
    tableHeight,
  };
}
