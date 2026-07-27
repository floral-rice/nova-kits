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
      const res = await auth.check();
      auth.onSuccess?.(res);
    } catch (err) {
      auth.onFail?.(err as Error);

      // 默认行为：重定向到登录页
      if (auth.redirectURL) {
        const currentUrl = encodeURIComponent(window.location.href);

        if (/^(?:https?:)?\/\//.test(auth.redirectURL)) {
          // 外部地址
          const url = new URL(auth.redirectURL);
          url.searchParams.set('redirect', currentUrl);
          window.location.href = url.toString();
        } else {
          // 内部路由
          const [pathname, search] = auth.redirectURL.split('?');
          const params = new URLSearchParams(search || '');
          params.set('redirect', currentUrl);
          window.location.href = `${pathname}?${params.toString()}`;
        }
      }
    } finally {
      loading.value = false;
    }
  };

  return { loading, checkAuth };
}
