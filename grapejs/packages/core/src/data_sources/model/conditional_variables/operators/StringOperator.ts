import { SimpleOperator } from './BaseOperator';

export enum StringOperation {
  contains = 'contains',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  matchesRegex = 'matchesRegex',
  equalsIgnoreCase = 'equalsIgnoreCase',
  trimEquals = 'trimEquals',
}

export class StringOperator extends SimpleOperator<StringOperation> {
  protected operationsEnum = StringOperation;

  evaluate(left: string, right: string) {
    if (typeof left !== 'string') return false;

    switch (this.operationString) {
      case StringOperation.contains:
        return left.includes(right);
      case StringOperation.startsWith:
        return left.startsWith(right);
      case StringOperation.endsWith:
        return left.endsWith(right);
      case StringOperation.matchesRegex:
        if (!right) this.em.logWarning('Regex pattern must be provided.');
        return new RegExp(right ?? '').test(left);
      case StringOperation.equalsIgnoreCase:
        return left.toLowerCase() === right.toLowerCase();
      case StringOperation.trimEquals:
        return left.trim() === right.trim();
      default:
        this.em.logWarning(`Unsupported string operation: ${this.operationString}`);
        return false;
    }
  }
}
