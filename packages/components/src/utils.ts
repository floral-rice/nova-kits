import { PREFIX_CLS } from './constants';

export function prefixClassName(prefix: string) {
  return (val?: string) => {
    return `${PREFIX_CLS}-${prefix}` + (val ? `-${val}` : '');
  };
}
