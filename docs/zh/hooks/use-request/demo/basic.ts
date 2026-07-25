import { useRequest } from '@nova-kits/hooks';

// 基础用法 - 手动触发请求
const { run, loading, data } = useRequest(
  () => {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Math.random() * 100);
      }, 1000);
    });
  },
  {
    onSuccess(res) {
      console.log('请求成功:', res);
    },
  },
);

// 点击按钮触发
// run();
