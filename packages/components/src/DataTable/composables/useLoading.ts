import { type Ref, watch } from 'vue';

export function useLoading(
  emit: (event: 'update:loading', value: boolean) => void,
  loading: Ref<boolean>,
  hasOnLoading?: boolean
) {
  /** 是否有外部 loading 监听 */
  const hasExternalLoading = hasOnLoading ?? false;

  // 同步 loading 状态到外部
  watch(loading, (val) => {
    if (hasExternalLoading) {
      emit('update:loading', val);
    }
  });

  return {
    hasExternalLoading,
  };
}
