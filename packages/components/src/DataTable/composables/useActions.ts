import { computed } from 'vue';
import type { ActionConfig } from '../typing';
import { useDataTableConfig } from './useDataTableConfig';

export function useActions<T>(
  actions: ActionConfig<T>[],
  maxActionCount: number = 3,
  actionWidth?: number | string
) {
  const config = useDataTableConfig();

  /** 可见按钮 */
  const visibleActions = computed(() => actions.slice(0, maxActionCount));

  /** 折叠到更多的按钮 */
  const moreActions = computed(() => actions.slice(maxActionCount));

  /** 操作列宽度 */
  const computedActionWidth = computed(() => {
    if (actionWidth) return actionWidth;
    return config.defaultActionWidth;
  });

  /** 判断按钮是否禁用 */
  const isDisabled = (action: ActionConfig<T>, row: T): boolean => {
    if (typeof action.disabled === 'function') {
      return action.disabled(row);
    }
    return action.disabled ?? false;
  };

  return {
    visibleActions,
    moreActions,
    computedActionWidth,
    isDisabled,
  };
}
