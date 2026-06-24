import { SimpleOperator } from './operators/BaseOperator';
import { DataConditionSimpleOperation } from './types';

export class ConditionStatement {
  constructor(
    private leftValue: any,
    private operator: SimpleOperator<DataConditionSimpleOperation>,
    private rightValue: any,
  ) {}

  evaluate(): boolean {
    return this.operator.evaluate(this.leftValue, this.rightValue);
  }
}
