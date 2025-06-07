import TransformableElement from '../TransformableElement/TransformableElement.js'
import Point from '../Point.js'
import Wire from '../Drawable/Drawables/Wire.js'
import Node from '../Drawable/Drawables/Node.js'

export default class Canvas2D extends TransformableElement {
  static get WORKSPACE_2D() {
    return document.getElementById('workspace2d')
  }
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
    }
  // Check Wether New Drawables Became Visible
    const CANVAS_BOUNDS = this.boundingClientRect
    let wireBounds, intersects
    for (let wire of Wire.s) {
      wireBounds = wire.boundingClientRect
      intersects = CANVAS_BOUNDS.X > wireBounds.x && CANVAS_BOUNDS.x < wireBounds.X && CANVAS_BOUNDS.Y > wireBounds.y && CANVAS_BOUNDS.y < wireBounds.Y
      wire.visible = intersects
    }
    this.update()
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
    return new Point(LOCAL_X, LOCAL_Y)
  }
  toGrid(x, y) {
    const LOCAL = this.toLocal(x, y)
    return new Point(Math.round(LOCAL.x), Math.round(LOCAL.y))
  }
  erase() {
    const LOCAL_START = this.toLocal(0, 0),
          LOCAL_END = this.toLocal(this.clientWidth, this.clientHeight)
    const WIDTH = LOCAL_END.x - LOCAL_START.x,
          HEIGHT = LOCAL_END.y - LOCAL_START.y
    this.#CTX.clearRect(LOCAL_START.x, LOCAL_START.y, WIDTH, HEIGHT)
  }
  get boundingClientRect() {
    const BOUNDING_CLIENT_RECT = document.body.getBoundingClientRect()
    const TOP_LEFT = this.toLocal(BOUNDING_CLIENT_RECT.left, BOUNDING_CLIENT_RECT.top),
          BOTTOM_RIGHT = this.toLocal(BOUNDING_CLIENT_RECT.right, BOUNDING_CLIENT_RECT.bottom)
    return {x: TOP_LEFT.x, y: TOP_LEFT.y, X: BOTTOM_RIGHT.x, Y: BOTTOM_RIGHT.y}
  }
  #requestedAnimationFrame
  set needsUpdate(bool) {
    if (bool && !this.#requestedAnimationFrame) {
      this.#requestedAnimationFrame = requestAnimationFrame(this.update)
    } else if (!bool && this.#requestedAnimationFrame) {
      this.cancelAnimationFrame(this.#requestedAnimationFrame)
      this.#requestedAnimationFrame = null
    }
  }
  update = function() {
    this.erase()
    this.draw()
    this.#requestedAnimationFrame = null
  }.bind(this)
  #DRAW_WIRE_POINTS = false
  draw = function() {
    const THICKNESS = .025,
          RADIUS = .25
    this.#CTX.beginPath()
    this.#CTX.rect(-THICKNESS/2, -RADIUS, THICKNESS, RADIUS*2)
    this.#CTX.rect(-RADIUS, -THICKNESS/2, RADIUS*2, THICKNESS)
    this.#CTX.fillStyle = '#f1f1f1'
    this.#CTX.fill()
    
    Wire.draw(this.#CTX)
    Node.draw(this.#CTX)
  }.bind(this)
}

customElements.define('canvas-2d', Canvas2D)