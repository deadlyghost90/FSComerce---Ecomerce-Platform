import { SimpleOperator } from './BaseOperator';

export enum NumberOperation {
  greaterThan = '>',
  lessThan = '<',
  greaterThanOrEqual = '>=',
  lessThanOrEqual = '<=',
  equals = '=',
  notEquals = '!=',
}

export class NumberOperator extends SimpleOperator<NumberOperation> {
  protected operationsEnum = NumberOperation;

  evaluate(left: number, right: number): boolean {
    if (typeof left !== 'number') return false;

    switch (this.operationString) {
      case NumberOperation.greaterThan:
        return left > right;
      case NumberOperation.lessThan:
        return left < right;
      case NumberOperation.greaterThanOrEqual:
        return left >= right;
      case NumberOperation.lessThanOrEqual:
        return left <= right;
      case NumberOperation.equals:
        return left === right;
      case NumberOperation.notEquals:
        return left !== right;
      default:
        this.em.logWarning(`Unsupported number operation: ${this.operationString}`);
        return false;
    }
  }
}
