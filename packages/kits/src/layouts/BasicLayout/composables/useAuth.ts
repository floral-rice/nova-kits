import { ref, type Ref } from 'vue';
import type { BasicLayoutProps } from '../typings';

/**
 * 鉴权 composable
 * 处理登录校验和重定向逻辑
 */
export default function useAuth(auth?: BasicLayoutProps['auth']): {
  loading: Ref<boolean>;
  checkAuth: () => Promise<void>;
} {
  const loading = ref(!!auth);

  const checkAuth = async () => {
    if (!auth) {
      loading.value = false;
      return;
    }

    try {
      const res: unknown = await auth.check();
      auth.onSuccess?.(res);
    } catch (err) {
      auth.onFail?.(err as Error);

      // 默认行为：重定向到登录页
      if (auth.redirectURL) {
        const currentUrl = encodeURIComponent(window.location.href);

        if (/^(?:https?:)?\/\//.test(auth.redirectURL)) {
          // 外部地址
          const url = new URL(auth.redirectURL);
          const search = new URLSearchParams(url.search);
          search.set('redirect', currentUrl);
          url.search = search.toString();
          window.location.href = url.toString();
        } else {
          // 内部路由，用正则解析 pathname 和 search
          const result = /([^?]*)(\?.*)?/.exec(auth.redirectURL);
          if (result !== null) {
            const pathname = result[1];
            const search = new URLSearchParams(result[2]);
            search.set('redirect', currentUrl);
            window.location.href = `${pathname}?${search.toString()}`;
          }
        }
      }
    } finally {
      loading.value = false;
    }
  };

  return { loading, checkAuth };
}
