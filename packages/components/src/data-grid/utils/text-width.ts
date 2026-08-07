/**
 * 计算文本宽度
 */
export function getTextWidth(text: string, font?: string): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0;

  context.font = font || '14px sans-serif';
  const metrics = context.measureText(text);

  return metrics.width;
}

/**
 * 估算列宽
 */
export function estimateColumnWidth(
  headerText: string,
  dataValues: any[],
  options?: {
    minWidth?: number;
    maxWidth?: number;
    padding?: number;
    font?: string;
  }
): number {
  const { minWidth = 80, maxWidth = 300, padding = 24, font = '14px sans-serif' } = options || {};

  // 计算表头宽度
  const headerWidth = getTextWidth(headerText, font);

  // 计算数据列最大宽度
  let dataWidth = 0;
  dataValues.forEach(value => {
    const text = String(value ?? '');
    const width = getTextWidth(text, font);
    dataWidth = Math.max(dataWidth, width);
  });

  // 取最大值
  const width = Math.max(headerWidth, dataWidth) + padding;

  // 限制范围
  return Math.min(Math.max(width, minWidth), maxWidth);
}
