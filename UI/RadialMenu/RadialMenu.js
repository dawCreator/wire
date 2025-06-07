import TransformableElement from '../TransformableElement/TransformableElement.js';
import Button from '../Button/Button.js'

class RadialMenu extends TransformableElement {
  hide() {
    this.removeAttribute('visible')
  }
  show() {
    this.setAttribute('visible', null)
  }
  init() {
    super.init()

    const CENTER_BUTTON = new Button()
    CENTER_BUTTON.classList.add('center')
    this.append(CENTER_BUTTON)
  }
}

customElements.define("radial-menu", RadialMenu)