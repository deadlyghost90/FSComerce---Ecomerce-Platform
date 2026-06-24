import { DataVariableProps } from '../DataVariable';
import EditorModel from '../../../editor/model/Editor';
import { valueOrResolve, isDataVariable, getDataResolverInstanceValue } from '../../utils';
import { ExpressionProps, LogicGroupProps } from './DataCondition';
import { LogicalGroupEvaluator } from './LogicalGroupEvaluator';
import { SimpleOperator } from './operators/BaseOperator';
import { AnyTypeOperation, AnyTypeOperator } from './operators/AnyTypeOperator';
import { BooleanOperator } from './operators/BooleanOperator';
import { NumberOperator, NumberOperation } from './operators/NumberOperator';
import { StringOperator, StringOperation } from './operators/StringOperator';
import { Model } from '../../../common';
import { DataConditionSimpleOperation } from './types';
import { isBoolean } from 'underscore';
import { DataCollectionStateMap } from '../data_collection/types';

export type ConditionProps = ExpressionProps | LogicGroupProps | boolean;

interface DataConditionEvaluatorProps {
  condition: ConditionProps;
}

interface DataConditionEvaluatorOptions {
  em: EditorModel;
  collectionsStateMap?: DataCollectionStateMap;
}

export class DataConditionEvaluator extends Model<DataConditionEvaluatorProps> {
  private em: EditorModel;
  private collectionsStateMap: DataCollectionStateMap = {};

  constructor(props: DataConditionEvaluatorProps, opts: DataConditionEvaluatorOptions) {
    super(props);
    this.em = opts.em;
    this.collectionsStateMap = opts.collectionsStateMap ?? {};
  }

  evaluate(): boolean {
    const condition = this.get('condition');
    if (!condition || isBoolean(condition)) return !!condition;

    const resolvedOperator = this.getOperator();
    if (!resolvedOperator) return false;
    return resolvedOperator.evaluate(this.getResolvedLeftValue(), this.getResolvedRightValue());
  }

  getDependentDataVariables(): DataVariableProps[] {
    const condition = this.get('condition');
    if (!condition) return [];

    return this.extractDataVariables(condition);
  }

  getOperations() {
    const operator = this.getOperator();
    if (!operator || operator instanceof LogicalGroupEvaluator) return [];

    return operator.getOperations();
  }

  updateCollectionStateMap(collectionsStateMap: DataCollectionStateMap) {
    this.collectionsStateMap = collectionsStateMap;
  }

  private getOperator() {
    const opts = { em: this.em, collectionsStateMap: this.collectionsStateMap };
    const condition = this.get('condition');
    if (!condition || isBoolean(condition)) return;
    let resolvedOperator: SimpleOperator<DataConditionSimpleOperation> | LogicalGroupEvaluator | undefined;

    if (this.isLogicGroup(condition)) {
      const { logicalOperator, statements } = condition;
      const operator = new BooleanOperator(logicalOperator, opts);
      resolvedOperator = new LogicalGroupEvaluator(operator, statements, opts);
    }

    if (this.isExpression(condition)) {
      const { left, operator } = condition;
      const evaluatedLeft = valueOrResolve(left, opts);

      resolvedOperator = this.resolveOperator(evaluatedLeft, operator);
    }

    return resolvedOperator;
  }

  /**
   * Factory method for creating operators based on the data type.
   */
  private resolveOperator(
    left: any,
    operator: string | undefined,
  ): SimpleOperator<DataConditionSimpleOperation> | undefined {
    const em = this.em;

    if (this.isOperatorInEnum(operator, AnyTypeOperation)) {
      return new AnyTypeOperator(operator as AnyTypeOperation, { em });
    } else if (typeof left === 'number') {
      return new NumberOperator(operator as NumberOperation, { em });
    } else if (typeof left === 'string') {
      return new StringOperator(operator as StringOperation, { em });
    }

    return;
  }

  private extractDataVariables(condition: ConditionProps): DataVariableProps[] {
    const variables: DataVariableProps[] = [];

    if (this.isExpression(condition)) {
      if (isDataVariable(condition.left)) variables.push(condition.left);
      if (isDataVariable(condition.right)) variables.push(condition.right);
    } else if (this.isLogicGroup(condition)) {
      condition.statements.forEach((stmt) => variables.push(...this.extractDataVariables(stmt)));
    }

    return variables;
  }

  private isLogicGroup(condition: any): condition is LogicGroupProps {
    return condition && typeof condition.logicalOperator !== 'undefined' && Array.isArray(condition.statements);
  }

  private isExpression(condition: any): condition is ExpressionProps {
    return condition && typeof condition.left !== 'undefined' && typeof condition.operator === 'string';
  }

  private isOperatorInEnum(operator: string | undefined, enumObject: any): boolean {
    return Object.values(enumObject).includes(operator);
  }

  private resolveExpressionSide(property: 'left' | 'right'): any {
    const condition = this.get('condition');
    const { em, collectionsStateMap } = this;

    if (!condition || typeof condition === 'boolean') {
      return condition;
    }

    if (condition && typeof condition === 'object' && property in condition) {
      const value = (condition as ExpressionProps)[property];
      return valueOrResolve(value, { em, collectionsStateMap });
    }

    return undefined;
  }

  private getResolvedLeftValue(): any {
    return this.resolveExpressionSide('left');
  }

  private getResolvedRightValue(): any {
    return this.resolveExpressionSide('right');
  }

  toJSON(options?: any) {
    const condition = this.get('condition');
    if (typeof condition === 'object') {
      const json = JSON.parse(JSON.stringify(condition));
      return json;
    }

    return condition;
  }
}
