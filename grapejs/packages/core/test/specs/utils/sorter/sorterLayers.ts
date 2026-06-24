import Component from '../../../../src/dom_components/model/Component';
import Editor from '../../../../src/editor';
import LayersComponentNode from '../../../../src/utils/sorter/LayersComponentNode';
import { setupTestEditor } from '../../../common';

describe('Layers sorter', () => {
  let editor: Editor;
  let fixtures: HTMLElement;

  const setCanvasVisibility = (cmp: Component, visible: boolean) => {
    const el = cmp.getEl();

    Object.defineProperty(el, 'offsetWidth', {
      configurable: true,
      get: () => (visible ? 120 : 0),
    });

    Object.defineProperty(el, 'offsetHeight', {
      configurable: true,
      get: () => (visible ? 24 : 0),
    });
  };

  const getChildIds = (cmp: Component) => cmp.components().map((child) => child.getAttributes().id);

  beforeEach(() => {
    ({ editor, fixtures } = setupTestEditor({ withCanvas: true }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    editor.destroy();
  });

  test('moves the hidden source after the target without removing other hidden siblings', () => {
    editor.setComponents(`
      <div id="hidden-a" style="display: none;"></div>
      <div id="visible-a">Visible A</div>
      <div id="visible-b">Visible B</div>
      <div id="hidden-b" style="display: none;"></div>
    `);

    const wrapper = editor.getWrapper()!;
    const source = wrapper.find('#hidden-a')[0];
    const target = wrapper.find('#visible-a')[0];
    const visibleSibling = wrapper.find('#visible-b')[0];
    const trailingHidden = wrapper.find('#hidden-b')[0];

    editor.select(source);
    editor.Layers.setRoot(wrapper);

    fixtures.appendChild(editor.Layers.render());

    const sorter = source.viewLayer!.sorter;
    const sourceLayer = source.viewLayer!.el;

    setCanvasVisibility(source, false);
    setCanvasVisibility(target, true);
    setCanvasVisibility(visibleSibling, true);
    setCanvasVisibility(trailingHidden, false);

    sorter.startSort([{ element: sourceLayer }]);
    sorter.dropLocationDeterminer.lastMoveData = {
      targetNode: new LayersComponentNode(wrapper),
      index: 2,
    };

    sorter.endDrag();

    expect(getChildIds(wrapper)).toEqual(['visible-a', 'hidden-a', 'visible-b', 'hidden-b']);
  });
});
