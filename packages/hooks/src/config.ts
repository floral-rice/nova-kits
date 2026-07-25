import { type InjectionKey, inject, provide, type App, type Component } from 'vue';

export interface HooksConfig {
  /**
   * 显示加载中的 toast
   * @returns toast 实例，用于取消显示
   */
  showToast: () => any;
  /**
   * 取消 toast 显示
   * @param toast toast 实例
   */
  cancelToast: (toast: any) => void;
  /**
   * 显示错误信息
   * @param err 错误对象
   */
  showError: (err: Error) => void;
  /**
   * 显示加载中状态
   * @returns 加载中组件或 null
   */
  showLoading: () => Component | null;
  /**
   * 错误结果展示
   * @param err 错误对象
   * @param refresh 刷新函数
   * @returns 错误展示组件或 null
   */
  errorResult: (err: Error, refresh: () => void) => Component | null;
  /**
   * 设置主题色
   * @param val 颜色值
   */
  setPrimaryColor: (val: string) => void;
  /**
   * 默认 throttle 时间，便于移动端使用
   */
  requestThrottleInterval: number;
  /**
   * request lock 防止 useRequest 重复调用
   */
  requestLock?: boolean;
}

const warning = (name: string) => {
  console.warn(`please implement: ${name}`);
};

export const defaultHooksConfig: HooksConfig = {
  showToast() {
    warning('showToast');
    return null;
  },
  cancelToast() {
    warning('cancelToast');
  },
  showError(err: Error) {
    console.error(err);
  },
  errorResult() {
    warning('errorResult');
    return null;
  },
  setPrimaryColor() {
    warning('setPrimaryColor');
  },
  showLoading() {
    warning('showLoading');
    return null;
  },
  requestThrottleInterval: 0,
  requestLock: false,
};

export const HOOKS_CONFIG_KEY: InjectionKey<HooksConfig> = Symbol('hooks-config');

/**
 * 获取 hooks 配置
 */
export function useHooksConfig(): HooksConfig {
  return inject(HOOKS_CONFIG_KEY, defaultHooksConfig);
}

/**
 * 提供 hooks 配置
 */
export function provideHooksConfig(config: Partial<HooksConfig>) {
  provide(HOOKS_CONFIG_KEY, { ...defaultHooksConfig, ...config });
}

/**
 * 创建 hooks 插件，用于全局配置
 */
export function createHooksPlugin(config: Partial<HooksConfig>) {
  return {
    install(app: App) {
      provideHooksConfig(config);
    },
  };
}
