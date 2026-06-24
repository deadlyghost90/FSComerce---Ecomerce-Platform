import {
  BooleanOperator,
  BooleanOperation,
} from '../../../../../../src/data_sources/model/conditional_variables/operators/BooleanOperator';
import Editor from '../../../../../../src/editor/model/Editor';
import EditorModel from '../../../../../../src/editor/model/Editor';

describe('LogicalOperator', () => {
  let em: EditorModel;

  beforeEach(() => {
    em = new Editor();
  });

  afterEach(() => {
    em.destroy();
  });

  describe('Operator: and', () => {
    test('should return true when all statements are true', () => {
      const operator = new BooleanOperator(BooleanOperation.and, { em });
      expect(operator.evaluate([true, true, true])).toBe(true);
    });

    test('should return false when at least one statement is false', () => {
      const operator = new BooleanOperator(BooleanOperation.and, { em });
      expect(operator.evaluate([true, false, true])).toBe(false);
    });
  });

  describe('Operator: or', () => {
    test('should return true when at least one statement is true', () => {
      const operator = new BooleanOperator(BooleanOperation.or, { em });
      expect(operator.evaluate([false, true, false])).toBe(true);
    });

    test('should return false when all statements are false', () => {
      const operator = new BooleanOperator(BooleanOperation.or, { em });
      expect(operator.evaluate([false, false, false])).toBe(false);
    });
  });

  describe('Operator: xor', () => {
    test('should return true when exactly one statement is true', () => {
      const operator = new BooleanOperator(BooleanOperation.xor, { em });
      expect(operator.evaluate([true, false, false])).toBe(true);
    });

    test('should return false when more than one statement is true', () => {
      const operator = new BooleanOperator(BooleanOperation.xor, { em });
      expect(operator.evaluate([true, true, false])).toBe(false);
    });

    test('should return false when no statement is true', () => {
      const operator = new BooleanOperator(BooleanOperation.xor, { em });
      expect(operator.evaluate([false, false, false])).toBe(false);
    });
  });

  describe('Edge Case Tests', () => {
    test('should return false for xor with all false inputs', () => {
      const operator = new BooleanOperator(BooleanOperation.xor, { em });
      expect(operator.evaluate([false, false])).toBe(false);
    });
  });
});
