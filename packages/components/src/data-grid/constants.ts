import type { IRowNode } from 'ag-grid-community';

// 汇总行标识
export const DataGridSummaryFlag = Symbol('summary');

// 序号列 ID
export const DataGridIndexColId = '$$index';

// 空列（用于填充）
export const DataGridEmptyCol = {
  colId: '$$empty',
  flex: 1,
  minWidth: 0,
  suppressMenu: true,
  sortable: false,
  filter: false,
  resizable: false,
};

// 判断是否是汇总行
export function isSummaryRow(params: { node?: IRowNode | null }): boolean {
  return params.node?.data?.[DataGridSummaryFlag as any] === true;
}
