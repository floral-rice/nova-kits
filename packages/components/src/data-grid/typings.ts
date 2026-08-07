import type {
  GridApi,
  GridOptions,
  ICellRendererParams,
  ICellEditorParams,
  IHeaderParams,
} from 'ag-grid-community';
import type { VNode, ClassValue, StyleValue } from 'vue';

// 排序类型
export interface SortType {
  field: string;
  order: 'asc' | 'desc';
}

// fetch 返回类型
export interface FetchResult<TData> {
  data: TData[];
  summary?: any;
  total?: number;
  extra?: any;
}

// fetch 参数类型
export interface FetchParams {
  current: number;
  pageSize: number;
  sort: SortType[];
}

// 行选择配置
export interface RowSelectionType<TData> {
  type?: 'checkbox' | 'radio';
  selectedRowKeys?: string[];
  onChange?: (keys: string[], rows: TData[]) => void;
  getCheckboxProps?: (record: TData) => { disabled?: boolean };
  checkboxSelection?: boolean;
  fixed?: 'left' | 'right';
  headerCheckboxSelectionFilteredOnly?: boolean;
  hideFooterSelected?: boolean;
}

// 分页配置
export interface PaginationType {
  current?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  showSizeChanger?: boolean;
  showTotal?: (total: number) => string;
  onChange?: (page: number, pageSize: number) => void;
}

// 编辑器类型
export type EditorType = 'text' | 'number' | 'date' | 'select';

// 校验规则
export interface ValidateRule<TData> {
  required?: boolean;
  message?: string;
  validator?: (value: any, data: TData) => boolean | string;
  pattern?: RegExp;
  min?: number;
  max?: number;
}

// 可编辑回调参数
export interface EditableCallbackParams<TData> {
  data: TData;
  colDef: ColType<TData>;
  rowIndex: number;
}

// 可编辑配置
export interface EditableConfig<TData> {
  enable?: (params: EditableCallbackParams<TData>) => boolean;
  rules?: ValidateRule<TData>[];
  valueSetter?: (val: any, data: TData) => Partial<TData>;
  renderer: EditorType | ((params: ICellEditorParams<TData>) => EditorType);
  params?: Record<string, any>;
}

// 列定义扩展
export interface ColType<TData> {
  title?: string | ((params: IHeaderParams) => VNode);
  dataIndex?: string;
  render?: (
    value: any,
    record: TData,
    index: number,
    params: ICellRendererParams
  ) => VNode | string | number | null;
  editable?: EditableConfig<TData>;
  [key: string]: any; // 允许其他 ColDef 属性
}

// 列分组类型
export interface ColGroupType<TData> {
  headerName: string;
  children: ColType<TData>[];
  marryChildren?: boolean;
  openByDefault?: boolean;
  groupId?: string;
}

// 列类型（支持分组）
export type ColsType<TData> = (ColType<TData> | ColGroupType<TData>)[];

// 行操作类型
export interface RowActionType<TData> {
  label: string | ((data: TData) => string);
  icon?: any;
  onClick: (data: TData, rowIndex: number) => void;
  disabled?: (data: TData) => boolean;
  danger?: boolean;
  confirm?: string | ((data: TData) => string);
}

export interface RowActionsType<TData> {
  actions: RowActionType<TData>[];
  maxVisible?: number;
}

// 主从表配置
export interface DetailCell<TData> {
  render: (data: TData, rowIndex: number) => VNode | string;
  height?: number | ((data: TData) => number);
  getExpandable?: (data: TData) => boolean;
}

// 搜索配置
export interface DataGridSearch {
  fields?: string[];
  placeholder?: string;
  onSearch?: (keyword: string) => void;
  onClear?: () => void;
}

// 汇总类型
export interface SummaryType {
  sum?: string[];
  avg?: string[];
  count?: boolean;
  max?: string[];
  min?: string[];
  custom?: Record<string, (data: any[]) => any>;
}

// 自定义列数据
export interface CustomColumnData {
  columns: CustomColumn[];
  order: string[];
}

export interface CustomColumn {
  id: string;
  title: string;
  expression: string;
  width?: number;
  visible?: boolean;
}

// 列定制面板存储
export interface CustomColumnStorage {
  set: (data: CustomColumnData) => Promise<void> | void;
  get: () => Promise<CustomColumnData | null | undefined> | CustomColumnData | null | undefined;
}

// 校验结果
export interface ValidateResult<TData> {
  rowIndex: number;
  data: TData;
  errors: Record<string, string[]>;
}

// DOM 布局模式
export type DomLayoutType = 'autoHeight' | 'print' | 'normal';

// 主组件 Props
export interface DataGridProps<TData extends Record<string, any>> {
  dataSource?: TData[];
  columns?: ColsType<TData>;
  rowKey: string | ((data: TData) => string);
  rowSelection?: RowSelectionType<TData>;
  pagination?: boolean | PaginationType;
  fetch?: (params: FetchParams) => Promise<FetchResult<TData>>;
  rowActions?: RowActionsType<TData>;
  summary?: SummaryType | Record<string, any>[];
  detailCell?: DetailCell<TData>;
  showSearch?: boolean | DataGridSearch;
  customColumnPanelStorage?: CustomColumnStorage;
  loading?: boolean;
  emptyText?: string;
  autoLoad?: boolean;
  enableEstimateInitialColumnWidth?: boolean;
  showIndex?: boolean;
  domLayout?: DomLayoutType;
  containerStyle?: StyleValue;
  class?: ClassValue;
  style?: StyleValue;
  gridOptions?: GridOptions;
}

// 事件
export interface DataGridEmits<TData extends Record<string, any>> {
  (e: 'grid-ready', api: GridApi<TData>): void;
  (e: 'row-click', data: TData, event: MouseEvent): void;
  (e: 'row-double-click', data: TData, event: MouseEvent): void;
  (e: 'cell-click', data: TData, colDef: ColType<TData>, event: MouseEvent): void;
  (e: 'cell-value-change', data: TData, colDef: ColType<TData>, newValue: any, oldValue: any): void;
  (e: 'selection-change', keys: string[], rows: TData[]): void;
  (e: 'sort-change', sort: SortType[]): void;
  (e: 'page-change', page: number, pageSize: number): void;
}

// 暴露接口
export interface DataGridExposed<TData extends Record<string, any>> {
  gridApi: GridApi<TData> | null;
  fetch: (page?: number) => void;
  refresh: () => void;
  pagination: (page: number, pageSize: number) => void;
  validate: () => Promise<boolean | ValidateResult<TData>[]>;
  setField: (field: any) => void;
  deleteField: (id: string) => void;
  saveFields: () => Promise<void>;
  resetFields: () => void;
  ready: () => boolean;
  isClientMode: () => boolean;
  focusPreviousCell: () => void;
  expandRow: (data: TData) => void;
  collapseRow: (data: TData) => void;
  expandAll: () => void;
  collapseAll: () => void;
}
