import { ref } from 'vue';
import { useRequest } from '@nova-kits/hooks';

const clickCount = ref(0);
const requestCount = ref(0);

const { run, loading, data } = useRequest(
  () => {
    requestCount.value++;
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`请求完成 ${new Date().toLocaleTimeString()}`);
      }, 1000);
    });
  },
  {
    throttleInterval: 1000, // 1秒节流
    onSuccess() {
      clickCount.value++;
    },
  },
);

// 点击按钮触发（节流）
// run();
