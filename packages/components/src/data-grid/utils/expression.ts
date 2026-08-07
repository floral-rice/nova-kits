// 表达式解析工具

// 安全求值
export function evaluateExpression(expression: string, context: Record<string, any>): any {
  try {
    // 替换字段引用为实际值
    const processedExpr = expression.replace(/\[([^\]]+)\]/g, (match, field) => {
      const value = context[field];
      if (value === undefined || value === null) return '0';
      return String(value);
    });

    // 使用 Function 构造函数求值
    return new Function(`return ${processedExpr}`)();
  } catch (error) {
    console.error('Expression evaluation error:', error);
    return null;
  }
}

// 验证表达式是否合法
export function validateExpression(expression: string): { valid: boolean; error?: string } {
  try {
    // 尝试编译表达式
    new Function(`return ${expression}`);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

// 获取表达式中引用的字段
export function getExpressionFields(expression: string): string[] {
  const fields: string[] = [];
  const regex = /\[([^\]]+)\]/g;
  let match;

  while ((match = regex.exec(expression)) !== null) {
    fields.push(match[1]);
  }

  return [...new Set(fields)];
}
