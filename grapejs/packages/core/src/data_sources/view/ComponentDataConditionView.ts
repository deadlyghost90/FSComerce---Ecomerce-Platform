import ComponentView from '../../dom_components/view/ComponentView';
import ComponentDataCondition from '../model/conditional_variables/ComponentDataCondition';
import DataResolverListener from '../model/DataResolverListener';

export default class ComponentDataConditionView extends ComponentView<ComponentDataCondition> {
  dataResolverListener!: DataResolverListener;

  initialize(opt = {}) {
    super.initialize(opt);

    this.postRender = this.postRender.bind(this);
    this.listenTo(this.model.components(), 'reset', this.postRender);
    this.dataResolverListener = new DataResolverListener({
      em: this.em,
      resolver: this.model.dataResolver,
      onUpdate: this.postRender,
    });
  }

  renderDataResolver() {
    const componentTrue = this.model.getIfTrueContent();
    const componentFalse = this.model.getIfFalseContent();

    const elTrue = componentTrue?.getEl();
    const elFalse = componentFalse?.getEl();

    const isTrue = this.model.isTrue();
    if (elTrue) {
      elTrue.style.display = isTrue ? '' : 'none';
    }
    if (elFalse) {
      elFalse.style.display = isTrue ? 'none' : '';
    }
  }

  postRender() {
    this.renderDataResolver();
    super.postRender();
  }

  remove() {
    this.stopListening(this.model.components(), 'reset', this.postRender);
    this.dataResolverListener.destroy();
    return super.remove();
  }
}
