import BaseElement from '../BaseElement/BaseElement.js'

export default class TransformableElement extends BaseElement {
  #TRANSFORM_FIELD_IDS = ['x', 'y', 'scale']
  #initTransformField = function(id) {
    var value = parseFloat(getComputedStyle(this).getPropertyValue(`--${id}`)), 
        valueNeedsUpdate = false
    const UPDATE_VALUE = function() {
      const TRANSFORM_EVENT = new CustomEvent('transformed')
      TRANSFORM_EVENT.id = id
      TRANSFORM_EVENT.oldValue = parseFloat(getComputedStyle(this).getPropertyValue(`--${id}`))
      TRANSFORM_EVENT.newValue = value

      this.style.setProperty(`--${id}`, value)

      this.dispatchEvent(TRANSFORM_EVENT)

      valueNeedsUpdate = false
    }.bind(this)
    Object.defineProperty(this, id, {
      get: () => {return value},
      set: float => {
        if (value == float) return
        value = float
        if (!valueNeedsUpdate) valueNeedsUpdate = requestAnimationFrame(UPDATE_VALUE)
      }
    })
  }
  init() {
    this.classList.add('transformable')
    for (let id of this.#TRANSFORM_FIELD_IDS) this.#initTransformField(id)
  }
}
customElements.define('transformable-element', TransformableElement)