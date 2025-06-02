import TransformableElement from '../TransformableElement/TransformableElement.js'

class Canvas2D extends TransformableElement {
  #CVS
  #CTX
  #ON_RESIZE = function() {
    const WIDTH = this.clientWidth,
          HEIGHT = this.clientHeight
    this.#CVS.width = WIDTH * devicePixelRatio
    this.#CVS.height = HEIGHT * devicePixelRatio
    const SCALE = devicePixelRatio * this.scale
    this.#CTX.scale(SCALE, SCALE)

    this.#CTX.translate((WIDTH/2+this.x)/this.scale, (HEIGHT/2+this.y)/this.scale)
    this.draw()
  }.bind(this)
  #ON_TRANSFORM = function(event) {
    switch (event.id) {
      case 'x':
        const DELTA_X = (event.newValue - event.oldValue)/this.scale
        this.#CTX.translate(DELTA_X, 0)
        break
      case 'y':
        const DELTA_Y = (event.newValue - event.oldValue)/this.scale
        this.#CTX.translate(0, DELTA_Y)
        break
      case 'scale':
        const DELTA_SCALE = event.newValue/event.oldValue
        const DX = this.x * -(1 - DELTA_SCALE),
              DY = this.y * -(1 - DELTA_SCALE)
        this.#CTX.scale(DELTA_SCALE, DELTA_SCALE)
        //this.#CTX.translate(DX, DY)
    }
    this.erase()
    this.draw()
  }
  init() {
    super.init()

    this.scale = 100

    this.#CVS = document.createElement('canvas')
    this.#CTX = this.#CVS.getContext('2d')
    this.append(this.#CVS)

    addEventListener('resize', this.#ON_RESIZE)
    this.#ON_RESIZE()

    this.addEventListener('transformed', this.#ON_TRANSFORM)
  }
  toLocal(x, y) {
    const BOUNDING_RECT = this.getBoundingClientRect(),
          SCALE = this.scale
    const LOCAL_X = (x - BOUNDING_RECT.width/2 - BOUNDING_RECT.x)/SCALE,
          LOCAL_Y = (y - BOUNDING_RECT.height/2 - BOUNDING_RECT.y)/SCALE
    return {x: LOCAL_X, y: LOCAL_Y}
  }
  erase() {
    const LOCAL_START = this.toLocal(0, 0),
          LOCAL_END = this.toLocal(this.clientWidth, this.clientHeight)
    const WIDTH = LOCAL_END.x - LOCAL_START.x,
          HEIGHT = LOCAL_END.y - LOCAL_START.y
    this.#CTX.clearRect(LOCAL_START.x, LOCAL_START.y, WIDTH, HEIGHT)
  }
  draw() {
    const THICKNESS = .1,
          RADIUS = .5
    this.#CTX.beginPath()
    this.#CTX.rect(-THICKNESS/2, -RADIUS, THICKNESS, RADIUS*2)
    this.#CTX.rect(-RADIUS, -THICKNESS/2, RADIUS*2, THICKNESS)
    this.#CTX.fillStyle = '#aaa'
    this.#CTX.fill()
  }
}

customElements.define('canvas-2d', Canvas2D)