import TransformableElement from '../TransformableElement/TransformableElement.js';

export default class Cursor extends TransformableElement {
  get canvas() {
    return this.parentElement
  }
  update(position) {
    const {x: X, y: Y} = this.canvas.toLocal(position.x, position.y)
    this.x = X
    this.y = Y
  }
}
customElements.define('wire-cursor', Cursor)