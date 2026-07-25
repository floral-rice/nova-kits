import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue';
import { debounce, throttle } from 'lodash-es';
import { useHooksConfig, type HooksConfig } from '../config';

/**
 * 发起网络请求, 主要面向场景: 提交单据、点击列表打开详情页前请求数据，自动捕获异常
 * @param request 网络请求方法
 * @param options 参数
 * @returns
 */
export default function useRequest<
  T extends (...args: any[]) => Promise<any> | any,
  K = T extends (...args: any) => Promise<infer U> | infer U ? U : never,
>(
  request: T,
  options: {
    /**
     * loading状态变化监听函数
     */
    onLoading?: (loading: boolean) => void;
    /**
     * 成功回调
     * @param res request返回的数据
     * @param params request的参数
     */
    onSuccess?: (res: K, params: Parameters<T>) => void;
    /**
     * 错误回调
     * @param err 异常，抛出异常的时候务必是Error的实例
     * @param params request的参数
     * @param showError 调用全局的错误信息提示
     */
    onError?: (err: Error, params: Parameters<T>, showError: () => void) => void;
    /**
     * 最终回调
     */
    onFinally?: () => void;
    /**
     * 节流模式的时间
     */
    throttleInterval?: number;
    /**
     * 防抖模式的时间
     */
    debounceInterval?: number;
    /**
     * 启用loading状态
     */
    loadingState?: boolean;
    /**
     * 是否展示加载中的toast
     */
    toast?: boolean;
    /**
     * 是否需要手动执行 默认 true，非手动模式默认会返回request返回的数据
     */
    manual?: boolean;
    /**
     * 自动模式data的默认值，否则就是null
     */
    defaultData?: K;
    /**
     * 非手动模式自动刷新的依赖项
     */
    refreshDeps?: Ref<any>[];
    /**
     * 在上一次未完成之前，防止重复调用
     */
    lock?: boolean;
    /**
     * 自定义错误处理，覆盖全局配置
     */
    showError?: (err: Error) => void;
  } = {},
) {
  const hooksConfig = useHooksConfig();

  const {
    onSuccess,
    onError,
    throttleInterval = hooksConfig.requestThrottleInterval || 0,
    debounceInterval = 0,
    loadingState = true,
    onLoading,
    toast = false,
    manual = true,
    defaultData = null as K,
    refreshDeps = [],
    onFinally,
    lock = hooksConfig.requestLock || false,
    showError: customShowError,
  } = options;

  const showError = customShowError || hooksConfig.showError;

  const loading = ref(false);
  const data = ref<K>(defaultData);
  const mounted = ref(false);
  const fetchId = ref(0);
  const lockRef = ref(false);
  const toastRef = ref<any>(null);

  const start = () => {
    if (toast && !toastRef.value) {
      toastRef.value = hooksConfig.showToast() || true;
    }

    if (loadingState) {
      loading.value = true;
    }

    if (onLoading) {
      onLoading(true);
    }
  };

  const end = () => {
    if (toastRef.value) {
      hooksConfig.cancelToast(toastRef.value);
      toastRef.value = null;
    }

    if (!mounted.value) {
      return;
    }

    if (loadingState) {
      loading.value = false;
    }

    if (onLoading) {
      onLoading(false);
    }
  };

  const run = async (...args: Parameters<T>) => {
    if (lockRef.value) {
      return;
    }

    if (lock) {
      lockRef.value = true;
    }

    fetchId.value += 1;
    start();

    const id = fetchId.value;

    try {
      const res = await request(...args);

      if (mounted.value && id === fetchId.value) {
        end();
        onSuccess?.(res, args);

        if (!manual) {
          data.value = res;
        }
      } else if (!mounted.value) {
        end();
      }
    } catch (err: any) {
      end();

      if (onError) {
        onError(err as Error, args, () => {
          showError(err as Error);
        });
      } else {
        showError(err as Error);
      }
    } finally {
      onFinally?.();
      lockRef.value = false;
    }
  };

  // 格式化执行函数（支持防抖和节流）
  let formatedRun: (...args: Parameters<T>) => void;

  if (debounceInterval) {
    formatedRun = debounce(run, debounceInterval);
  } else if (throttleInterval) {
    formatedRun = throttle(run, throttleInterval, { trailing: false });
  } else {
    formatedRun = run;
  }

  // 非手动模式，自动执行
  onMounted(() => {
    mounted.value = true;
    if (!manual) {
      run(...([] as unknown as Parameters<T>));
    }
  });

  // 监听依赖变化，自动刷新
  if (refreshDeps.length > 0 && !manual) {
    watch(refreshDeps, () => {
      run(...([] as unknown as Parameters<T>));
    });
  }

  // 清理
  onUnmounted(() => {
    mounted.value = false;
  });

  return {
    /**
     * 手动执行函数
     */
    run: formatedRun,
    /**
     * loading状态
     */
    loading: loading as Ref<boolean>,
    /**
     * 数据
     */
    data: data as Ref<K>,
  };
}
