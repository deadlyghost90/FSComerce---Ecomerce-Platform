import Component from '../../dom_components/model/Component';
import { SortableTreeNode } from './SortableTreeNode';

/**
 * BaseComponentNode is an abstract class that provides basic operations
 * for managing component nodes in a tree structure. It extends
 * SortableTreeNode to handle sorting behavior for components.
 * Subclasses must implement the `view` and `element` methods.
 */
export abstract class BaseComponentNode extends SortableTreeNode<Component> {
  private displayCache: Map<Component, boolean> = new Map();

  /**
   * Get the list of child components.
   * @returns {BaseComponentNode[] | null} - The list of children wrapped in
   * BaseComponentNode, or null if there are no children.
   */
  getChildren(): BaseComponentNode[] | null {
    return this.model.components().map((comp: Component) => new (this.constructor as any)(comp));
  }

  /**
   * Get the parent component of this node.
   * @returns {BaseComponentNode | null} - The parent wrapped in BaseComponentNode,
   * or null if no parent exists.
   */
  getParent(): BaseComponentNode | null {
    const parent = this.model.parent();
    return parent ? new (this.constructor as any)(parent) : null;
  }

  /**
   * Add a child component to this node at the specified index.
   * @param {BaseComponentNode} node - The child node to add.
   * @param {number} index - The index at which to insert the child.
   * @param {{ action: string }} options - Options for the operation, with the default action being 'add-component'.
   * @returns {BaseComponentNode} - The newly added child node wrapped in BaseComponentNode.
   */
  addChildAt(
    node: BaseComponentNode,
    index: number,
    options: { action: string } = { action: 'add-component' },
  ): BaseComponentNode {
    const insertingTextableIntoText = this.model?.isInstanceOf?.('text') && node?.model?.get?.('textable');

    if (insertingTextableIntoText) {
      // @ts-ignore: Handle inserting textable components
      return this.model?.getView?.()?.insertComponent?.(node?.model, { action: options.action });
    }

    const newModel = this.model.components().add(node.model, {
      at: index,
      action: options.action,
    });

    return new (this.constructor as any)(newModel);
  }

  /**
   * Remove a child component at the specified index.
   * @param {number} index - The visual index of the child to remove.
   * @param {{ temporary: boolean }} options - Whether to temporarily remove the child.
   */
  removeChildAt(index: number, options: { temporary: boolean } = { temporary: false }): void {
    const child = this.model.components().at(index);
    if (child) {
      this.model.components().remove(child, options as any);
    }
  }

  /**
   * Get the visual index of a child node within the displayed children.
   * @param {BaseComponentNode} node - The child node to locate.
   * @returns {number} - The index of the child node, or -1 if not found.
   */
  indexOfChild(node: BaseComponentNode): number {
    return this.getIndex(node);
  }

  /**
   * Get the index of the given node.
   * @param {BaseComponentNode} node - The node to find.
   * @returns {number} - The index of the node, or -1 if not found.
   */
  private getIndex(node: BaseComponentNode): number {
    const Children = this.getChildren();
    return Children ? Children.findIndex((Node) => Node.model === node.model) : -1;
  }

  /**
   * Check if a source node can be moved to a specified index within this component.
   * @param {BaseComponentNode} source - The source node to move.
   * @param {number} index - The index to move the source to.
   * @returns {boolean} - True if the move is allowed, false otherwise.
   */
  canMove(source: BaseComponentNode, index: number): boolean {
    return this.model.em.Components.canMove(this.model, source.model, index).result;
  }

  equals(node?: BaseComponentNode): node is BaseComponentNode {
    return !!node?._model && this._model.getId() === node._model.getId();
  }

  /**
   * Abstract method to get the view associated with this component.
   * Subclasses must implement this method.
   * @abstract
   */
  abstract get view(): any;

  /**
   * Abstract method to get the DOM element associated with this component.
   * Subclasses must implement this method.
   * @abstract
   */
  abstract get element(): HTMLElement | undefined;

  /**
   * Reset the state of the node by clearing its status and disabling editing.
   */
  restNodeState(): void {
    this.clearState();
    const { model } = this;
    this.setContentEditable(false);
    model.em.getEditing() === model && this.disableEditing();
  }

  /**
   * Set the contentEditable property of the node's DOM element.
   * @param {boolean} value - True to make the content editable, false to disable editing.
   */
  setContentEditable(value: boolean): void {
    if (this.element && this.isTextNode()) {
      this.element.contentEditable = value ? 'true' : 'false';
    }
  }

  /**
   * Disable editing capabilities for the component's view.
   * This method depends on the presence of the `disableEditing` method in the view.
   */
  private disableEditing(): void {
    // @ts-ignore
    this.view?.disableEditing?.();
  }

  /**
   * Clear the current state of the node by resetting its status.
   */
  private clearState(): void {
    this.model.set?.('status', '');
  }

  /**
   * Set the state of the node to 'selected-parent'.
   */
  setSelectedParentState(): void {
    this.model.set?.('status', 'selected-parent');
  }

  /**
   * Determine if the component is a text node.
   * @returns {boolean} - True if the component is a text node, false otherwise.
   */
  isTextNode(): boolean {
    return this.model.isInstanceOf?.('text');
  }

  /**
   * Determine if the component is textable.
   * @returns {boolean} - True if the component is textable, false otherwise.
   */
  isTextable(): boolean {
    return this.model.get?.('textable');
  }
}
