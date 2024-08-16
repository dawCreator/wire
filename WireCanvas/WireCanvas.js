import TransformableElement from '../TransformableElement/TransformableElement.js'

class WireCanvas extends TransformableElement {
  #CVS
  #CTX
  #ON_RESIZE = function() {
    const WIDTH = this.clientWidth,
          HEIGHT = this.clientHeight
    this.#CVS.width = WIDTH * devicePixelRatio
    this.#CVS.height = HEIGHT * devicePixelRatio

    const SCALE = devicePixelRatio * this.scale
    this.#CTX.scale(SCALE, SCALE)

    this.#CTX.translate(WIDTH/2, HEIGHT/2)
    
    this.draw()
  }.bind(this)
  init() {
    this.#CVS = document.createElement('canvas')
    this.#CTX = this.#CVS.getContext('2d')
    this.append(this.#CVS)

    this.addEventListener('resize', 'appended', this.#ON_RESIZE)
    this.#ON_RESIZE()

    this.append(document.createElement('test'))
  }
  draw() {
    this.#CTX.fillRect(-50, -50, 100, 100)
  }
}
customElements.define('wire-canvas', WireCanvas)