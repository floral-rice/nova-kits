import type { Component, VNode, StyleValue, ClassValue } from 'vue';

/** 渲染函数类型 */
export type RenderFunction<T = any> = (row: T, index: number) => VNode | string | number;

/** 定义渲染列的辅助函数，帮助 TypeScript 推导类型 */
export function defineRenderColumn<T>(
  config: Omit<ColumnConfig<T>, 'render'> & { render: RenderFunction<T> }
): ColumnConfig<T> {
  return config;
}

// ============ 列配置 ============
export interface ColumnConfig<T = any> {
  /** 字段名，必须是 T 的属性 */
  prop?: string & keyof T;
  /** 表头标题 */
  label: string;
  /** 列宽，默认 140（可通过全局配置覆盖） */
  width?: number | string;
  /** 最小列宽 */
  minWidth?: number | string;
  /** 固定方向 */
  fixed?: 'left' | 'right';
  /** 是否可排序 */
  sortable?: boolean | 'custom';
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right';
  /** 溢出提示 */
  showOverflowTooltip?: boolean;

  /**
   * 自定义渲染 - 四种形式
   * 1. 函数返回 VNode: (row, index) => h(Component, props)
   * 2. 函数返回值: (row, index) => 'text' 或 (row, index) => 123
   * 3. 插槽名: 'my-slot'
   * 4. 组件引用: MyComponent
   */
  render?: RenderFunction<T> | string | Component;

  /** 传递给组件的额外 props */
  renderProps?: Record<string, any>;
  /** 子列配置（表头分组） */
  children?: ColumnConfig<T>[];
}

// ============ 操作按钮 ============
export interface ActionConfig<T = any> {
  /** 按钮文字 */
  label: string;
  /** 点击事件，传入行数据 */
  onClick: (row: T) => void;
  /** 禁用状态 */
  disabled?: boolean | ((row: T) => boolean);
  /** 按钮类型 */
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** 图标组件 */
  icon?: Component;
}

// ============ 分页配置 ============
export interface PaginationConfig {
  /** 每页条数，默认 20 */
  pageSize?: number;
  /** 可选每页条数 */
  pageSizes?: number[];
  /** 分页器布局 */
  layout?: string;
}

export type OrderType = 'ascending' | 'descending';

// ============ FetchPage 参数 ============
export interface FetchPageParams {
  current: number;
  pageSize: number;
  order?: {
    prop: string;
    order: OrderType;
  };
}

// ============ FetchPage 返回 ============
export interface FetchPageResult<T = any> {
  total: number;
  content: T[];
}

// ============ 行选择配置 ============
export interface RowSelectActions<T = any> {
  /** 选择类型：checkbox 多选、radio 单选 */
  type: 'checkbox' | 'radio';
  /** 当前已选的 key（单选时为单个值，多选时为数组） */
  selectedKey?: string | number | (string | number)[];
  /** 选择改变回调（始终返回数组） */
  onSelected?: (rowSelectedKeys: (string | number)[], rows: T[]) => void;
}

// ============ DataTable 全局配置 ============
export interface DataTableConfig {
  /** 全局默认列宽 */
  defaultColumnWidth?: number;
  /** 全局默认操作列宽 */
  defaultActionWidth?: number;
  /** 全局分页配置 */
  pagination?: PaginationConfig;
}

// ============ DataTable Props ============
export interface DataTableProps<T = any> {
  /** 客户端数据 */
  data?: T[];
  /** 远程分页函数 */
  fetchPage?: (params: FetchPageParams) => Promise<FetchPageResult<T>>;
  /** 列配置 */
  columns: ColumnConfig<T>[];

  /** 分页配置（远程分页时强制显示分页器） */
  pagination?: boolean | PaginationConfig;
  /** 是否自动加载，默认 false */
  autoLoad?: boolean;

  /** 是否显示序号列 */
  showIndex?: boolean;
  /** 序号列宽度 */
  indexWidth?: number | string;

  /** 操作按钮配置 */
  actions?: ActionConfig<T>[];
  /** 最多显示的操作按钮数，默认 3 */
  maxActionCount?: number;
  /** 操作列宽度，默认 120 */
  actionWidth?: number | string;

  /** 表格高度模式 */
  domLayout?: 'normal' | 'autoHeight';

  /** 自定义类名 */
  class?: ClassValue;
  /** 自定义样式 */
  style?: StyleValue;
  /** 斑马纹，默认 true */
  stripe?: boolean;
  /** 边框 */
  border?: boolean;

  /** 空状态文案 */
  emptyText?: string;

  /** 行唯一标识字段名或获取函数，默认 'id' */
  rowKey?: string | ((row: T) => string | number);

  /** 行选择配置 */
  rowSelectActions?: RowSelectActions<T>;
}

// ============ DataTable Emits ============
export interface DataTableEmits {
  'update:loading': [value: boolean];
  'row-click': [row: any, column: any, event: Event];
}

// ============ DataTable Expose ============
export interface DataTableExpose<T = any> {
  /** 触发数据加载 */
  fetch: () => Promise<void>;
  /** 刷新当前页 */
  refresh: () => Promise<void>;
  /** 当前表格数据 */
  data: T[];
  /** 加载状态 */
  loading: boolean;
}
