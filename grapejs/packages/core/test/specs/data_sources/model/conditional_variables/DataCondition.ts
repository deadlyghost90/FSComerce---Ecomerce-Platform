import { DataSourceManager } from '../../../../../src';
import {
  DataCondition,
  ExpressionProps,
  LogicGroupProps,
} from '../../../../../src/data_sources/model/conditional_variables/DataCondition';
import { AnyTypeOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/AnyTypeOperator';
import { BooleanOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/BooleanOperator';
import { NumberOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/NumberOperator';
import { StringOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/StringOperator';
import { DataVariableType } from '../../../../../src/data_sources/model/DataVariable';
import Editor from '../../../../../src/editor/model/Editor';
import EditorModel from '../../../../../src/editor/model/Editor';

describe('DataCondition', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  const dataSource = {
    id: 'USER_STATUS_SOURCE',
    records: [
      { id: 'USER_1', age: 25, status: 'active' },
      { id: 'USER_2', age: 12, status: 'inactive' },
    ],
  };

  beforeEach(() => {
    em = new Editor();
    dsm = em.DataSources;
    dsm.add(dataSource);
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Basic Functionality Tests', () => {
    test('should evaluate a simple boolean condition', () => {
      const condition = true;
      const dataCondition = new DataCondition({ condition, ifTrue: 'Yes', ifFalse: 'No' }, { em });

      expect(dataCondition.getDataValue()).toBe('Yes');
    });

    test('should return ifFalse when condition evaluates to false', () => {
      const condition = false;
      const dataCondition = new DataCondition({ condition, ifTrue: 'Yes', ifFalse: 'No' }, { em });

      expect(dataCondition.getDataValue()).toBe('No');
    });

    test('should return raw ifTrue value when skipDynamicValueResolution is true and condition is true', () => {
      const condition = true;
      const ifTrue = { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' };
      const ifFalse = 'No';

      const dataCondition = new DataCondition({ condition, ifTrue, ifFalse }, { em });
      expect(dataCondition.getDataValue(true)).toEqual(ifTrue);
    });

    test('should return raw ifFalse value when skipDynamicValueResolution is true and condition is false', () => {
      const condition = false;
      const ifTrue = 'Yes';
      const ifFalse = { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' };

      const dataCondition = new DataCondition({ condition, ifTrue, ifFalse }, { em });
      expect(dataCondition.getDataValue(true)).toEqual(ifFalse);
    });
  });

  describe('Operator Tests', () => {
    test('should evaluate using GenericOperation operators', () => {
      const condition: ExpressionProps = { left: 5, operator: AnyTypeOperation.equals, right: 5 };
      const dataCondition = new DataCondition({ condition, ifTrue: 'Equal', ifFalse: 'Not Equal' }, { em });

      expect(dataCondition.getDataValue()).toBe('Equal');
    });

    test('equals (false)', () => {
      const condition: ExpressionProps = {
        left: 'hello',
        operator: AnyTypeOperation.equals,
        right: 'world',
      };
      const dataCondition = new DataCondition({ condition, ifTrue: 'true', ifFalse: 'false' }, { em });
      expect(dataCondition.isTrue()).toBe(false);
    });

    test('should evaluate using StringOperation operators', () => {
      const condition: ExpressionProps = { left: 'apple', operator: StringOperation.contains, right: 'app' };
      const dataCondition = new DataCondition({ condition, ifTrue: 'Contains', ifFalse: "Doesn't contain" }, { em });

      expect(dataCondition.getDataValue()).toBe('Contains');
    });

    test('should evaluate using NumberOperation operators', () => {
      const condition: ExpressionProps = { left: 10, operator: NumberOperation.lessThan, right: 15 };
      const dataCondition = new DataCondition({ condition, ifTrue: 'Valid', ifFalse: 'Invalid' }, { em });

      expect(dataCondition.getDataValue()).toBe('Valid');
    });

    test('should evaluate using LogicalOperation operators', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          { left: 5, operator: NumberOperation.greaterThan, right: 3 },
        ],
      };

      const dataCondition = new DataCondition({ condition: logicGroup, ifTrue: 'Pass', ifFalse: 'Fail' }, { em });
      expect(dataCondition.getDataValue()).toBe('Pass');
    });
  });

  describe('Edge Case Tests', () => {
    test('should evaluate complex nested conditions', () => {
      const nestedLogicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.or,
        statements: [
          {
            logicalOperator: BooleanOperation.and,
            statements: [
              { left: 1, operator: NumberOperation.lessThan, right: 5 },
              { left: 'test', operator: AnyTypeOperation.equals, right: 'test' },
            ],
          },
          { left: 10, operator: NumberOperation.greaterThan, right: 100 },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: nestedLogicGroup, ifTrue: 'Nested Pass', ifFalse: 'Nested Fail' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('Nested Pass');
    });
  });

  describe('LogicalGroup Tests', () => {
    test('should correctly handle AND logical operator', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          { left: 5, operator: NumberOperation.greaterThan, right: 3 },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'All true', ifFalse: 'One or more false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('All true');
    });

    test('should correctly handle OR logical operator', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.or,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: false },
          { left: 5, operator: NumberOperation.greaterThan, right: 3 },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'At least one true', ifFalse: 'All false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('At least one true');
    });

    test('should correctly handle XOR logical operator', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.xor,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          { left: 5, operator: NumberOperation.lessThan, right: 3 },
          { left: false, operator: AnyTypeOperation.equals, right: true },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'Exactly one true', ifFalse: 'Multiple true or all false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('Exactly one true');
    });

    test('should handle nested logical groups', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          {
            logicalOperator: BooleanOperation.or,
            statements: [
              { left: 5, operator: NumberOperation.greaterThan, right: 3 },
              { left: false, operator: AnyTypeOperation.equals, right: true },
            ],
          },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'All true', ifFalse: 'One or more false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('All true');
    });

    test('should handle groups with false conditions', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          { left: true, operator: AnyTypeOperation.equals, right: true },
          { left: false, operator: AnyTypeOperation.equals, right: true },
          { left: 5, operator: NumberOperation.greaterThan, right: 3 },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'All true', ifFalse: 'One or more false' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('One or more false');
    });
  });

  describe('Conditions with dataVariables', () => {
    test('should return "Yes" when dataVariable matches expected value', () => {
      const condition: ExpressionProps = {
        left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
        operator: AnyTypeOperation.equals,
        right: 'active',
      };

      const dataCondition = new DataCondition({ condition, ifTrue: 'Yes', ifFalse: 'No' }, { em });
      expect(dataCondition.getDataValue()).toBe('Yes');
    });

    test('should return "No" when dataVariable does not match expected value', () => {
      const condition: ExpressionProps = {
        left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
        operator: AnyTypeOperation.equals,
        right: 'inactive',
      };

      const dataCondition = new DataCondition({ condition, ifTrue: 'Yes', ifFalse: 'No' }, { em });
      expect(dataCondition.getDataValue()).toBe('No');
    });

    // TODO: unskip after adding UndefinedOperator
    test.skip('should handle missing data variable gracefully', () => {
      const condition: ExpressionProps = {
        left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.not_a_user.status' },
        operator: AnyTypeOperation.isDefined,
        right: undefined,
      };

      const dataCondition = new DataCondition({ condition, ifTrue: 'Found', ifFalse: 'Not Found' }, { em });
      expect(dataCondition.getDataValue()).toBe('Not Found');
    });

    test('should correctly compare numeric values from dataVariables', () => {
      const condition: ExpressionProps = {
        left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.age' },
        operator: NumberOperation.greaterThan,
        right: 24,
      };
      const dataCondition = new DataCondition({ condition, ifTrue: 'Valid', ifFalse: 'Invalid' }, { em });
      expect(dataCondition.getDataValue()).toBe('Valid');
    });

    test('should evaluate logical operators with multiple data sources', () => {
      const dataSource2 = {
        id: 'SECOND_DATASOURCE_ID',
        records: [{ id: 'RECORD_2', status: 'active', age: 22 }],
      };
      dsm.add(dataSource2);

      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.and,
        statements: [
          {
            left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
            operator: AnyTypeOperation.equals,
            right: 'active',
          },
          {
            left: { type: DataVariableType, path: 'SECOND_DATASOURCE_ID.RECORD_2.age' },
            operator: NumberOperation.greaterThan,
            right: 18,
          },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'All conditions met', ifFalse: 'Some conditions failed' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('All conditions met');
    });

    test('should handle nested logical conditions with data variables', () => {
      const logicGroup: LogicGroupProps = {
        logicalOperator: BooleanOperation.or,
        statements: [
          {
            logicalOperator: BooleanOperation.and,
            statements: [
              {
                left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_2.status' },
                operator: AnyTypeOperation.equals,
                right: 'inactive',
              },
              {
                left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_2.age' },
                operator: NumberOperation.lessThan,
                right: 14,
              },
            ],
          },
          {
            left: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
            operator: AnyTypeOperation.equals,
            right: 'inactive',
          },
        ],
      };

      const dataCondition = new DataCondition(
        { condition: logicGroup, ifTrue: 'Condition met', ifFalse: 'Condition failed' },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('Condition met');
    });

    test('should handle data variables as an ifTrue return value', () => {
      const dataCondition = new DataCondition(
        {
          condition: true,
          ifTrue: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
          ifFalse: 'No',
        },
        { em },
      );
      expect(dataCondition.getDataValue()).toBe('active');
    });

    test('should handle data variables as an ifFalse return value', () => {
      const dataCondition = new DataCondition(
        {
          condition: false,
          ifTrue: 'Yes',
          ifFalse: { type: DataVariableType, path: 'USER_STATUS_SOURCE.USER_1.status' },
        },
        { em },
      );

      expect(dataCondition.getDataValue()).toBe('active');
    });
  });
});
