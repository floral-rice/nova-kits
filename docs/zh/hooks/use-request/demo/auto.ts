import { useRequest } from '@nova-kits/hooks';

// 自动请求 - 页面加载时自动执行
const { loading, data } = useRequest(
  () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`自动请求的数据 ${new Date().toLocaleTimeString()}`);
      }, 1500);
    });
  },
  {
    manual: false, // 自动执行
  },
);
