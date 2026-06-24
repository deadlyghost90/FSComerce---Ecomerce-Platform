import { AnyTypeOperation } from './operators/AnyTypeOperator';
import { BooleanOperation } from './operators/BooleanOperator';
import { NumberOperation } from './operators/NumberOperator';
import { StringOperation } from './operators/StringOperator';

export type DataConditionSimpleOperation = AnyTypeOperation | StringOperation | NumberOperation | BooleanOperation;
export type DataConditionCompositeOperation = DataConditionSimpleOperation;
