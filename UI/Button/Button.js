import TransformableElement from '../TransformableElement/TransformableElement.js';

class Button extends TransformableElement {
/*
  BUTTON STATE:
  sends CustomEvent on state change
*/
  get isOn() {
    return this.hasAttribute('on')
  }
  set isOn(value) {
    if (value != this.isOn) {
      if (value) this.setAttribute('on', null)
      else this.removeAttribute('on')
    // Dispatch Event
      const EVENT_TYPE = value ? 'on' : 'off',
            EVENT = new CustomEvent(EVENT_TYPE)
      this.dispatchEvent(EVENT)
    }
  }

  get isSwitch() {
    return this.hasAttribute("switch")
  }
  init() {
    super.init()
    this.addEventListener('pointerdown', function(down) {
      if (this.isSwitch) this.isOn = !this.isOn
    }.bind(this))
    this.addEventListener('pointerup', function(up) {
      this.isOn = !this.isOn
    }.bind(this))
  }
}

customElements.define('wire-button', Button)