import { provide, inject, type InjectionKey, type Ref } from 'vue';
import type { GridApi } from 'ag-grid-community';

interface GridContext<TData> {
  gridApi: Ref<GridApi<TData> | null>;
  errors: any;
}

const GridContextKey: InjectionKey<GridContext<any>> = Symbol('grid-context');

export function provideGridContext<TData>(context: GridContext<TData>) {
  provide(GridContextKey, context);
}

export function useGridContext<TData>(): GridContext<TData> {
  const context = inject(GridContextKey);
  if (!context) {
    throw new Error('useGridContext must be used within a DataGrid component');
  }
  return context;
}
