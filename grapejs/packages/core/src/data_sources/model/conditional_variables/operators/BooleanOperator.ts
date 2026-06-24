import { SimpleOperator } from './BaseOperator';

export enum BooleanOperation {
  and = 'and',
  or = 'or',
  xor = 'xor',
}

export class BooleanOperator extends SimpleOperator<BooleanOperation> {
  protected operationsEnum = BooleanOperation;

  evaluate(statements: boolean[]): boolean {
    if (!statements?.length) return false;

    switch (this.operationString) {
      case BooleanOperation.and:
        return statements.every(Boolean);
      case BooleanOperation.or:
        return statements.some(Boolean);
      case BooleanOperation.xor:
        return statements.filter(Boolean).length === 1;
      default:
        this.em.logWarning(`Unsupported boolean operation: ${this.operationString}`);
        return false;
    }
  }
}
