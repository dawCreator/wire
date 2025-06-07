import TransformableElement from '../TransformableElement/TransformableElement.js';
import Wire from '../Drawable/Drawables/Wire.js';

export default class Cursor extends TransformableElement {
  get canvas() {
    return this.parentElement
  }
  update(position) {
    const GRID_POSITION = this.canvas.toGrid(position.clientX, position.clientY)
    if (this.x != GRID_POSITION.x || this.y != GRID_POSITION.y) {
      this.x = GRID_POSITION.x
      this.y = GRID_POSITION.y
    // Check If Wire Hit
      for (let wire of Wire.s) {
        const IS_HIT = wire.intersectingPoint(GRID_POSITION)
        wire.selected = IS_HIT
      }
    }
  
  }
}
customElements.define('wire-cursor', Cursor)