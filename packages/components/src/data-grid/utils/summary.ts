import BigNumber from 'bignumber.js';
import type { SummaryType } from '../typings';

// 求和
export function sum(data: any[], field: string): number {
  return data.reduce((acc, row) => {
    const value = Number(row[field]);
    if (isNaN(value)) return acc;
    return new BigNumber(acc).plus(value).toNumber();
  }, 0);
}

// 平均值
export function avg(data: any[], field: string): number {
  if (data.length === 0) return 0;
  const total = sum(data, field);
  return new BigNumber(total).div(data.length).toNumber();
}

// 最大值
export function max(data: any[], field: string): number {
  if (data.length === 0) return 0;
  return Math.max(...data.map(row => Number(row[field]) || 0));
}

// 最小值
export function min(data: any[], field: string): number {
  if (data.length === 0) return 0;
  return Math.min(...data.map(row => Number(row[field]) || 0));
}

// 计算汇总行
export function calcSummary<TData>(data: TData[], config: SummaryType): Record<string, any> {
  const result: Record<string, any> = {};

  if (config.sum) {
    config.sum.forEach(field => {
      result[field] = sum(data, field);
    });
  }

  if (config.avg) {
    config.avg.forEach(field => {
      result[field] = avg(data, field);
    });
  }

  if (config.count) {
    result._count = data.length;
  }

  if (config.max) {
    config.max.forEach(field => {
      result[field] = max(data, field);
    });
  }

  if (config.min) {
    config.min.forEach(field => {
      result[field] = min(data, field);
    });
  }

  if (config.custom) {
    Object.entries(config.custom).forEach(([field, fn]) => {
      result[field] = fn(data);
    });
  }

  return result;
}
