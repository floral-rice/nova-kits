import { App } from 'vue';
export * from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/scrollbar.scss';
import './styles/_variables.scss';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

export { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal, useTabFocus } from './Layout/index';
export { DataTable, DataTable as NDataTable, provideDataTableConfig, defineRenderColumn } from './DataTable/index';
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
} from './DataTable/index';
export { NSection } from './Section/index';

import { NLayoutWithSub as NLayout, NLayoutTabs, NLayoutPortal } from './Layout/index';
import { NSection } from './Section/index';
import { DataTable } from './DataTable/index';

export function install(app: App) {
  app.component('NLayout', NLayout);
  app.component('NLayoutTabs', NLayoutTabs);
  app.component('NLayoutPortal', NLayoutPortal);
  app.component('NSection', NSection);
  app.component('NDataTable', DataTable);
  app.use(ElementPlus);
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

export default {
  install,
};
