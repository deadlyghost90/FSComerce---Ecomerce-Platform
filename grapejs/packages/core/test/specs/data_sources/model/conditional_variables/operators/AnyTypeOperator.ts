import {
  AnyTypeOperator,
  AnyTypeOperation,
} from '../../../../../../src/data_sources/model/conditional_variables/operators/AnyTypeOperator';
import Editor from '../../../../../../src/editor/model/Editor';
import EditorModel from '../../../../../../src/editor/model/Editor';

describe('GenericOperator', () => {
  let em: EditorModel;

  beforeEach(() => {
    em = new Editor();
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Operator: equals', () => {
    test('should return true when values are equal', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.equals, { em });
      expect(operator.evaluate(5, 5)).toBe(true);
    });

    test('should return false when values are not equal', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.equals, { em });
      expect(operator.evaluate(5, 10)).toBe(false);
    });
  });

  describe('Operator: isTruthy', () => {
    test('should return true for truthy value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isTruthy, { em });
      expect(operator.evaluate('non-empty', null)).toBe(true);
    });

    test('should return false for falsy value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isTruthy, { em });
      expect(operator.evaluate('', null)).toBe(false);
    });
  });

  describe('Operator: isFalsy', () => {
    test('should return true for falsy value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isFalsy, { em });
      expect(operator.evaluate(0, null)).toBe(true);
    });

    test('should return false for truthy value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isFalsy, { em });
      expect(operator.evaluate(1, null)).toBe(false);
    });
  });

  describe('Operator: isDefined', () => {
    test('should return true for defined value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isDefined, { em });
      expect(operator.evaluate(10, null)).toBe(true);
    });

    test('should return false for undefined value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isDefined, { em });
      expect(operator.evaluate(undefined, null)).toBe(false);
    });
  });

  describe('Operator: isNull', () => {
    test('should return true for null value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNull, { em });
      expect(operator.evaluate(null, null)).toBe(true);
    });

    test('should return false for non-null value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNull, { em });
      expect(operator.evaluate(0, null)).toBe(false);
    });
  });

  describe('Operator: isUndefined', () => {
    test('should return true for undefined value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isUndefined, { em });
      expect(operator.evaluate(undefined, null)).toBe(true);
    });

    test('should return false for defined value', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isUndefined, { em });
      expect(operator.evaluate(0, null)).toBe(false);
    });
  });

  describe('Operator: isArray', () => {
    test('should return true for array', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isArray, { em });
      expect(operator.evaluate([1, 2, 3], null)).toBe(true);
    });

    test('should return false for non-array', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isArray, { em });
      expect(operator.evaluate('not an array', null)).toBe(false);
    });
  });

  describe('Operator: isObject', () => {
    test('should return true for object', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isObject, { em });
      expect(operator.evaluate({ key: 'value' }, null)).toBe(true);
    });

    test('should return false for non-object', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isObject, { em });
      expect(operator.evaluate(42, null)).toBe(false);
    });
  });

  describe('Operator: isString', () => {
    test('should return true for string', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isString, { em });
      expect(operator.evaluate('Hello', null)).toBe(true);
    });

    test('should return false for non-string', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isString, { em });
      expect(operator.evaluate(42, null)).toBe(false);
    });
  });

  describe('Operator: isNumber', () => {
    test('should return true for number', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNumber, { em });
      expect(operator.evaluate(42, null)).toBe(true);
    });

    test('should return false for non-number', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNumber, { em });
      expect(operator.evaluate('not a number', null)).toBe(false);
    });
  });

  describe('Operator: isBoolean', () => {
    test('should return true for boolean', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isBoolean, { em });
      expect(operator.evaluate(true, null)).toBe(true);
    });

    test('should return false for non-boolean', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isBoolean, { em });
      expect(operator.evaluate(1, null)).toBe(false);
    });
  });

  describe('Edge Case Tests', () => {
    test('should handle null as input gracefully', () => {
      const operator = new AnyTypeOperator(AnyTypeOperation.isNull, { em });
      expect(operator.evaluate(null, null)).toBe(true);
    });
  });
});
