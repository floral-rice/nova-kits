import { reactive } from 'vue';
import Schema from 'async-validator';
import type { GridApi } from 'ag-grid-community';
import type { DataGridProps, ValidateResult } from '../typings';

export function useValidation<TData extends Record<string, any>>(
  props: DataGridProps<TData>,
  gridApi: () => GridApi<TData> | null
) {
  // 错误状态 { rowIndex: { field: [errors] } }
  const errors = reactive<Record<number, Record<string, string[]>>>({});

  // 清除错误
  function clearErrors(rowIndex?: number, field?: string) {
    if (rowIndex !== undefined) {
      if (field) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (errors[rowIndex]) {
          delete errors[rowIndex][field];
        }
      } else {
        delete errors[rowIndex];
      }
    } else {
      Object.keys(errors).forEach(key => {
        delete errors[Number(key)];
      });
    }
  }

  // 设置错误
  function setError(rowIndex: number, field: string, messages: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    errors[rowIndex] = errors[rowIndex] || {};
    errors[rowIndex][field] = messages;
  }

  // 校验单行
  async function validateRow(rowIndex: number): Promise<boolean | ValidateResult<TData>> {
    const api = gridApi();
    if (!api) return true;

    const rowNode = api.getDisplayedRowAtIndex(rowIndex);
    if (!rowNode || !rowNode.data) return true;

    const data = rowNode.data;
    clearErrors(rowIndex);

    const rules: Record<string, any> = {};
    const columns = props.columns || [];

    columns.forEach((col: any) => {
      if (col.editable?.rules && col.dataIndex) {
        rules[col.dataIndex] = col.editable.rules.map((rule: any) => ({
          ...rule,
          validator: rule.validator
            ? (rule: any, value: any, callback: any) => {
                const result = rule.validator(value, data);
                if (typeof result === 'string') {
                  callback(new Error(result));
                } else if (!result) {
                  callback(new Error(rule.message || `${col.title || col.dataIndex} 校验失败`));
                } else {
                  callback();
                }
              }
            : undefined,
        }));
      }
    });

    if (Object.keys(rules).length === 0) return true;

    const schema = new Schema(rules);
    const values: Record<string, any> = {};

    columns.forEach((col: any) => {
      if (col.dataIndex) {
        values[col.dataIndex] = data[col.dataIndex];
      }
    });

    try {
      await schema.validate(values);
      return true;
    } catch (err: any) {
      if (err.errors) {
        err.errors.forEach((error: any) => {
          setError(rowIndex, error.field, error.message ? [error.message] : []);
        });
      }

      return {
        rowIndex,
        data,
        errors: errors[rowIndex] ?? {},
      };
    }
  }

  // 校验全表
  async function validate(): Promise<boolean | ValidateResult<TData>[]> {
    const api = gridApi();
    if (!api) return true;

    clearErrors();

    const results: ValidateResult<TData>[] = [];
    const rowCount = api.getDisplayedRowCount();

    for (let i = 0; i < rowCount; i++) {
      const result = await validateRow(i);
      if (result !== true) {
        results.push(result as ValidateResult<TData>);
      }
    }

    return results.length === 0 ? true : results;
  }

  // 获取单元格错误
  function getCellErrors(rowIndex: number, field: string): string[] {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return errors[rowIndex]?.[field] ?? [];
  }

  // 判断单元格是否有错误
  function hasCellError(rowIndex: number, field: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (errors[rowIndex]?.[field]?.length ?? 0) > 0;
  }

  return {
    errors,
    validate,
    validateRow,
    clearErrors,
    getCellErrors,
    hasCellError,
  };
}
