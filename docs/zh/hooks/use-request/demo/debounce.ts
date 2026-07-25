import { ref, watch } from 'vue';
import { useRequest } from '@nova-kits/hooks';

const keyword = ref('');

const { run, loading, data } = useRequest(
  (searchKeyword: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`搜索 "${searchKeyword}" 的结果`);
      }, 500);
    });
  },
  {
    debounceInterval: 500, // 500ms 防抖
    onSuccess(res) {
      console.log('搜索成功:', res);
    },
  },
);

// 输入时触发搜索
watch(keyword, (val) => {
  if (val) run(val);
});
