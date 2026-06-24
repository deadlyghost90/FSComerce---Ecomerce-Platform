export enum CssEvents {
  /**
   * @event `css:mount` CSS rule is mounted in the canvas.
   * @example
   * editor.on('css:mount', ({ rule }) => { ... });
   */
  mount = 'css:mount',
  mountBefore = 'css:mount:before',
}
