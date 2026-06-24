import { ComponentOptions, ComponentProperties } from '../../dom_components/model/types';
import { toLowerCase } from '../../utils/mixins';
import DataVariable, { DataVariableProps, DataVariableType } from './DataVariable';
import { ComponentWithDataResolver } from './ComponentWithDataResolver';
import { DataResolver } from '../types';
import { DataCollectionStateMap } from './data_collection/types';

export interface ComponentDataVariableProps extends ComponentProperties {
  type?: typeof DataVariableType;
  dataResolver?: DataVariableProps;
}

export default class ComponentDataVariable extends ComponentWithDataResolver<DataVariableProps> {
  get defaults() {
    return {
      // @ts-ignore
      ...super.defaults,
      type: DataVariableType,
      dataResolver: {},
      droppable: false,
    };
  }

  getPath() {
    return this.dataResolver.get('path');
  }

  getCollectionId() {
    return this.dataResolver.get('collectionId');
  }

  getVariableType() {
    return this.dataResolver.get('variableType');
  }

  getDefaultValue() {
    return this.dataResolver.get('defaultValue');
  }

  getDataValue() {
    return this.dataResolver.getDataValue();
  }

  resolvesFromCollection() {
    return this.dataResolver.resolvesFromCollection();
  }

  getInnerHTML() {
    return this.getDataValue();
  }

  setPath(newPath: string) {
    this.dataResolver.set('path', newPath);
  }

  setDefaultValue(newValue: string) {
    this.dataResolver.set('defaultValue', newValue);
  }

  /**
   * Sets the data source path and resets related properties.
   * This will set collectionId and variableType to undefined as it's typically
   * used when changing to a completely different data source.
   * @param newPath The new path to set as the data source
   */
  resetDataSourcePath(newPath: string) {
    this.set('dataResolver', {
      path: newPath,
      collectionId: undefined,
      variableType: undefined,
    });
  }

  protected createResolverInstance(
    props: DataVariableProps,
    options: ComponentOptions & { collectionsStateMap: DataCollectionStateMap },
  ): DataResolver {
    return new DataVariable(props, options);
  }

  static isComponent(el: HTMLElement) {
    return toLowerCase(el.tagName) === DataVariableType;
  }
}
