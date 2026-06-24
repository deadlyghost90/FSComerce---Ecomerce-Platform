import EditorModel from '../../../../editor/model/Editor';
import { enumToArray } from '../../../utils';
import { DataConditionSimpleOperation } from '../types';

export abstract class SimpleOperator<OperationType extends DataConditionSimpleOperation> {
  protected em: EditorModel;
  protected operationString: OperationType;
  protected abstract operationsEnum: Record<string, OperationType>;

  constructor(operationString: any, opts: { em: EditorModel }) {
    this.operationString = operationString;
    this.em = opts.em;
  }

  abstract evaluate(left: any, right: any): boolean;

  getOperations(): DataConditionSimpleOperation[] {
    return enumToArray(this.operationsEnum);
  }
}
