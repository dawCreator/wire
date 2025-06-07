import TransformableElement from '../TransformableElement/TransformableElement.js';

export default class ElectricComponent extends TransformableElement {
  get isDiagonal() {
    return this.hasAttribute('diagonal')
  }
  set isDiagonal(bool) {
    if (this.isDiagonal != bool) {
      if (bool) this.setAttribute('diagonal', null)
      else this.removeAttribute('diagonal')
    }
  }
  init() {
    super.init()
    this.classList.add('component')
  }
  set position(position) {
    const GRID_POSITION = WIRE_CANVAS.toGrid(position.x, position.y)
    this.x = GRID_POSITION.x
    this.y = GRID_POSITION.y
  }
  set direction(direction) {
    const LOCAL = WIRE_CANVAS.toLocal(direction.x, direction.y)
    
    this.style.setProperty('--rotation', `${DIRECTION}rad`)

    this.isDiagonal = Direction.isDiagonal(DIRECTION)
  }
}

customElements.define('electric-component', ElectricComponent)