import EditorModel from '../../../editor/model/Editor';
import { DataCollectionStateMap } from '../data_collection/types';
import { DataConditionEvaluator, ConditionProps } from './DataConditionEvaluator';
import { BooleanOperator } from './operators/BooleanOperator';

export class LogicalGroupEvaluator {
  constructor(
    private operator: BooleanOperator,
    private statements: ConditionProps[],
    private opts: { em: EditorModel; collectionsStateMap: DataCollectionStateMap },
  ) {}

  evaluate(): boolean {
    const results = this.statements.map((statement) => {
      const condition = new DataConditionEvaluator({ condition: statement }, this.opts);
      return condition.evaluate();
    });

    return this.operator.evaluate(results);
  }
}
