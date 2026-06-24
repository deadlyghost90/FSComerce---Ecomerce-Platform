import Component from '../../../dom_components/model/Component';
import { ComponentDefinitionDefined, ToHTMLOptions } from '../../../dom_components/model/types';
import { toLowerCase } from '../../../utils/mixins';
import { isComponentDataOutputType } from '../../utils';

export default class ConditionalOutputBase extends Component {
  get defaults(): ComponentDefinitionDefined {
    return {
      // @ts-ignore
      ...super.defaults,
      removable: false,
      draggable: false,
    };
  }

  static isComponent(el: HTMLElement) {
    return isComponentDataOutputType(toLowerCase(el.tagName));
  }
}
