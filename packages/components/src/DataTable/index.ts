import DataTable from './DataTable.vue';

export { DataTable, DataTable as NDataTable };
export { provideDataTableConfig } from './composables/useDataTableConfig';
export { defineRenderColumn } from './typing';
export type {
  ColumnConfig,
  ActionConfig,
  PaginationConfig,
  FetchPageParams,
  FetchPageResult,
  DataTableConfig,
  DataTableProps,
  DataTableEmits,
  DataTableExpose,
  RenderFunction,
  RowSelectActions,
} from './typing';

export default DataTable;
