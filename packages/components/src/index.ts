import { App } from 'vue';
export * from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/scrollbar.scss';
import './styles/_variables.scss';
import ElementPlus from 'element-plus';

export { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal, useTabFocus } from './Layout/index';

import { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal } from './Layout/index';

// DataGrid
export {
  NDataGrid,
  DataGridSummaryFlag,
  DataGridIndexColId,
  DataGridEmptyCol,
  isSummaryRow,
  TextEditor,
  NumberEditor,
  DateEditor,
  SelectEditor,
  EditorWrapper,
  evaluateExpression,
  validateExpression,
  getExpressionFields,
  calcSummary,
  sum,
  avg,
  max,
  min,
  getTextWidth,
  estimateColumnWidth,
} from './data-grid/index';

export type {
  DataGridProps,
  DataGridEmits,
  DataGridExposed,
  ColType,
  ColGroupType,
  ColsType,
  RowSelectionType,
  PaginationType,
  FetchParams,
  FetchResult,
  SortType,
  RowActionType,
  RowActionsType,
  DetailCell,
  EditableConfig,
  EditorType,
  ValidateRule,
  ValidateResult,
  CustomColumn,
  CustomColumnData,
  CustomColumnStorage,
  DataGridSearch,
  SummaryType,
} from './data-grid/typings';

import { NDataGrid } from './data-grid/index';

export function install(app: App) {
  app.component('NLayout', NLayout);
  app.component('NLayoutTabs', NLayoutTabs);
  app.component('NLayoutPortal', NLayoutPortal);
  app.component('NDataGrid', NDataGrid);
  app.use(ElementPlus);
}

export default {
  install,
};
