import zhCN from './zh_CN';

export type Locale = typeof zhCN;

const locales: Record<string, Locale> = {
  'zh-CN': zhCN,
};

let currentLocale = 'zh-CN';

export function setLocale(locale: string) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return locales[currentLocale];
}

export function t(key: keyof Locale): string {
  const locale = getLocale();
  return locale[key] || key;
}

export default {
  setLocale,
  getLocale,
  t,
};
