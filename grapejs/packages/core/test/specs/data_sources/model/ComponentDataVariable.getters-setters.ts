import { DataSourceManager } from '../../../../src';
import ComponentDataVariable from '../../../../src/data_sources/model/ComponentDataVariable';
import { DataVariableType } from '../../../../src/data_sources/model/DataVariable';
import ComponentWrapper from '../../../../src/dom_components/model/ComponentWrapper';
import EditorModel from '../../../../src/editor/model/Editor';
import { setupTestEditor } from '../../../common';

describe('ComponentDataVariable - setPath and setDefaultValue', () => {
  let em: EditorModel;
  let dsm: DataSourceManager;
  let cmpRoot: ComponentWrapper;

  beforeEach(() => {
    ({ em, dsm, cmpRoot } = setupTestEditor());
    const dataSource = {
      id: 'ds_id',
      records: [
        { id: 'id1', name: 'Name1' },
        { id: 'id2', name: 'Name2' },
      ],
    };

    dsm.add(dataSource);
  });

  afterEach(() => {
    em.destroy();
  });

  test('component updates when path is changed using setPath', () => {
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver: {
        defaultValue: 'default',
        path: 'ds_id.id1.name',
      },
    })[0] as ComponentDataVariable;

    expect(cmp.getEl()?.innerHTML).toContain('Name1');
    expect(cmp.getPath()).toBe('ds_id.id1.name');

    cmp.setPath('ds_id.id2.name');
    expect(cmp.getEl()?.innerHTML).toContain('Name2');
    expect(cmp.getPath()).toBe('ds_id.id2.name');
  });

  test('component updates when default value is changed using setDefaultValue', () => {
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { defaultValue: 'default', path: 'unknown.id1.name' },
    })[0] as ComponentDataVariable;

    expect(cmp.getEl()?.innerHTML).toContain('default');
    expect(cmp.getDefaultValue()).toBe('default');

    cmp.setDefaultValue('new default');
    expect(cmp.getEl()?.innerHTML).toContain('new default');
    expect(cmp.getDefaultValue()).toBe('new default');
  });

  test('component updates correctly after path and default value are changed', () => {
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { defaultValue: 'default', path: 'ds_id.id1.name' },
    })[0] as ComponentDataVariable;

    expect(cmp.getEl()?.innerHTML).toContain('Name1');

    cmp.setPath('ds_id.id2.name');
    expect(cmp.getEl()?.innerHTML).toContain('Name2');

    cmp.setDefaultValue('new default');
    dsm.all.reset();
    expect(cmp.getEl()?.innerHTML).toContain('new default');
    expect(cmp.getDefaultValue()).toBe('new default');
  });

  test('component updates correctly after path is changed and data is updated', () => {
    const cmp = cmpRoot.append({
      type: DataVariableType,
      dataResolver: { defaultValue: 'default', path: 'ds_id.id1.name' },
    })[0] as ComponentDataVariable;

    expect(cmp.getEl()?.innerHTML).toContain('Name1');

    cmp.setPath('ds_id.id2.name');
    expect(cmp.getEl()?.innerHTML).toContain('Name2');

    const ds = dsm.get('ds_id');
    ds.getRecord('id2')?.set({ name: 'Name2-UP' });
    expect(cmp.getEl()?.innerHTML).toContain('Name2-UP');
  });
});
