import { DataSourceManager } from '../../../../../src';
import { DataVariableType } from '../../../../../src/data_sources/model/DataVariable';
import ComponentDataCondition from '../../../../../src/data_sources/model/conditional_variables/ComponentDataCondition';
import { DataConditionType } from '../../../../../src/data_sources/model/conditional_variables/DataCondition';
import { AnyTypeOperation } from '../../../../../src/data_sources/model/conditional_variables/operators/AnyTypeOperator';
import ComponentDataConditionView from '../../../../../src/data_sources/view/ComponentDataConditionView';
import ComponentWrapper from '../../../../../src/dom_components/model/ComponentWrapper';
import EditorModel from '../../../../../src/editor/model/Editor';
import {
  ifFalseText,
  setupTestEditor,
  ifTrueComponentDef,
  ifFalseComponentDef,
  newIfTrueText,
  ifTrueText,
  FALSE_CONDITION,
  TRUE_CONDITION,
  newIfFalseText,
  newIfTrueComponentDef,
  newIfFalseComponentDef,
} from '../../../../common';

describe('ComponentDataCondition Setters', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
  });

  afterEach(() => {
    em.destroy();
  });

  it('should update the condition using setCondition', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    component.setCondition(FALSE_CONDITION);
    expect(component.getCondition()).toEqual(FALSE_CONDITION);
    expect(component.getInnerHTML()).toContain(ifFalseText);
    expect(component.getEl()?.innerHTML).toContain(ifFalseText);
  });

  it('should update the ifTrue value using setIfTrueComponents', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    component.setIfTrueComponents(newIfTrueComponentDef.components);
    expect(JSON.parse(JSON.stringify(component.getIfTrueContent()))).toEqual(newIfTrueComponentDef);
    expect(component.getInnerHTML()).toContain(newIfTrueText);
    expect(component.getEl()?.innerHTML).toContain(newIfTrueText);
  });

  it('should update the ifFalse value using setIfFalseComponents', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    component.setIfFalseComponents(newIfFalseComponentDef.components);
    expect(JSON.parse(JSON.stringify(component.getIfFalseContent()))).toEqual(newIfFalseComponentDef);

    component.setCondition(FALSE_CONDITION);
    expect(component.getInnerHTML()).toContain(newIfFalseText);
    expect(component.getEl()?.innerHTML).toContain(newIfFalseText);
  });

  it('should update the data sources and re-evaluate the condition', () => {
    const dataSource = {
      id: 'ds1',
      records: [
        { id: 'left_id', left: 'Name1' },
        { id: 'right_id', right: 'Name1' },
      ],
    };
    dsm.add(dataSource);

    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: {
        condition: {
          left: {
            type: DataVariableType,
            path: 'ds1.left_id.left',
          },
          operator: AnyTypeOperation.equals,
          right: {
            type: DataVariableType,
            path: 'ds1.right_id.right',
          },
        },
      },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    expect(component.getInnerHTML()).toContain(ifTrueText);

    changeDataSourceValue(dsm, 'Different value');
    expect(component.getInnerHTML()).toContain(ifFalseText);
    expect(component.getEl()?.innerHTML).toContain(ifFalseText);

    changeDataSourceValue(dsm, 'Name1');
    expect(component.getInnerHTML()).toContain(ifTrueText);
    expect(component.getEl()?.innerHTML).toContain(ifTrueText);
  });

  it('should re-render the component when condition, ifTrue, or ifFalse changes', () => {
    const component = cmpRoot.append({
      type: DataConditionType,
      dataResolver: { condition: TRUE_CONDITION },
      components: [ifTrueComponentDef, ifFalseComponentDef],
    })[0] as ComponentDataCondition;

    const componentView = component.getView() as ComponentDataConditionView;

    component.setIfTrueComponents(newIfTrueComponentDef);

    expect(component.getInnerHTML()).toContain(newIfTrueText);
    expect(componentView.el.innerHTML).toContain(newIfTrueText);

    component.setIfFalseComponents(newIfFalseComponentDef);
    component.setCondition(FALSE_CONDITION);
    expect(component.getInnerHTML()).toContain(newIfFalseText);
    expect(componentView.el.innerHTML).toContain(newIfFalseText);
  });
});

export const changeDataSourceValue = (dsm: DataSourceManager, newValue: string) => {
  dsm.get('ds1').getRecord('left_id')?.set('left', newValue);
};
