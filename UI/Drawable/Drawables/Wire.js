import Drawable from '../Drawable.js'
import Direction from '../../Direction.js'
import Canvas2D from '../../Canvas2D/Canvas2D.js'

export default class Wire extends Drawable {
  static #s = []
  static get s() {
    return this.#s
  }
  static get selected() {
    return this.s.filter(wire => wire.selected)
  }
  static get visible() {
    return this.s.filter(wire => wire.visible)
  }
  static get editing() {
    return this.s.filter(wire => wire.editing && wire.visible)
  }
  static LINE_WIDTH = .05
  static LINE_WIDTH_SELECTED = .1
  static #DRAW_WIRE_POINTS = false
  static draw(context) {
    // Draw Selected Wires Outlines
    context.beginPath()
    context.lineWidth = Wire.LINE_WIDTH_SELECTED
    context.strokeStyle = 'rgb(255, 184, 92)'
    context.lineJoin = 'round' // || 'bevel' || 'miter' (Standard)
    for (let wire of Wire.selected) {
      wire.draw(context)
    }
    context.stroke()
  // Draw Wires
    context.beginPath()
    context.lineWidth = Wire.LINE_WIDTH
    context.lineCap = 'round'
    context.strokeStyle = '#666'
    for (let wire of Wire.visible) {
      wire.draw(context)
    }
    context.stroke()
  // Draw Wires Currently Edited
    context.beginPath()
    context.strokeStyle = '#ccc'
    for (let wire of Wire.editing) {
      wire.draw(context)
    }
    context.stroke()
  // Draw Wire Points For Debugging
    if (this.#DRAW_WIRE_POINTS) {
      context.beginPath()
      context.fillStyle = '#222'
      for (let wire of Wire.visible) {
        wire.drawPoints(context)
      }
      context.fill()
    }
  }
  #points = []
  addPoint(point) {
    this.#points.push(point)
  // Update Bounding Client Rect:
    const LINE_WIDTH_OFFSET = Wire.LINE_WIDTH/2
    this.#boundingClientRect.x = Math.min(this.#boundingClientRect.x, point.x - LINE_WIDTH_OFFSET) 
    this.#boundingClientRect.y = Math.min(this.#boundingClientRect.y, point.y - LINE_WIDTH_OFFSET)
    this.#boundingClientRect.X = Math.max(this.#boundingClientRect.X, point.x + LINE_WIDTH_OFFSET)
    this.#boundingClientRect.Y = Math.max(this.#boundingClientRect.Y, point.y + LINE_WIDTH_OFFSET)
  }
  get start() {
    return this.#points[0]
  }
  get end() {
    return this.#points[this.#points.length-1]
  }
  #reverse() {
    this.#points.reverse()
  }
  constructor(event) {
    super()
    Wire.s.push(this)
    this.handleDown(event)
  }
  #boundingClientRect = {x: Infinity, y: Infinity, X: -Infinity, Y: -Infinity}
  get boundingClientRect() {
    return this.#boundingClientRect
  }
  intersectingPoint(point) {
    const ROUGH_HIT = point.insideRect(this.#boundingClientRect)
    if (ROUGH_HIT) {
      return point.onPath(this.#points)
    }
    return false
  }
  handleDown = function(down) {
    this.editing = true
    const CVS = down.target,
          START_POSITION = CVS.toGrid(down.x, down.y)
    this.addPoint(START_POSITION)

    const WORKSPACE_2D = Canvas2D.WORKSPACE_2D
    WORKSPACE_2D.addEventListener('pointermove', this.handleMove)
    WORKSPACE_2D.addEventListener('pointerleave', 'pointerup', 'pointercancel', this.handleUp)
  }.bind(this)
  handleMove = function(move) {
    const CVS = move.target,
          CURSOR = CVS.toLocal(move.x, move.y),
          END_POINT = CVS.toGrid(move.x, move.y)
    let lastPoint = this.end,
        direction,
        pointIndex,
        pointExists
    let maxIterations = 10
    while (!END_POINT.equals(lastPoint)) {
      direction = Direction.fromTwoPoints(lastPoint, CURSOR)
      lastPoint = lastPoint.stepInDirectionFor(direction)
      pointIndex = this.#points.findIndex(point => lastPoint.equals(point))
      pointExists = 0 <= pointIndex
      if (pointExists) {
        this.#points.length = pointIndex + 1
      } else {
        this.addPoint(lastPoint)
      }
      if (!--maxIterations) break
    }
    CVS.needsUpdate = true
  }.bind(this)
  handleUp = function() {
    if (this.#points.length < 1) this.remove()
    this.editing = false

    const WORKSPACE_2D = Canvas2D.WORKSPACE_2D
    WORKSPACE_2D.removeEventListener('pointermove', this.handleMove)
    WORKSPACE_2D.removeEventListener('pointerup', 'pointercancel', 'pointerleave', this.handleUp)
  }.bind(this)
  draw(context) {
    const [FIRST_POINT, ...POINTS] = this.#points
    context.moveTo(FIRST_POINT.x, FIRST_POINT.y)
    for (let point of POINTS) {
      context.lineTo(point.x, point.y)
    }
  }
  drawPoints(context) {
    for (let point of this.#points) {
      context.moveTo(point.x, point.y)
      context.arc(point.x, point.y, .075, 0, Math.PI * 2)
    }
  }
  #selected
  get selected() {
    return this.#selected
  }
  set selected(bool) {
    if (!this.editing && this.selected != bool) {
      this.#selected = bool
      const CVS = Canvas2D.WORKSPACE_2D
      CVS.needsUpdate = true
    }
  }
  #visible = true
  get visible() {
    return this.#visible
  }
  set visible(bool) {
    if (this.visible != bool) {
      this.#visible = bool
      const CVS = Canvas2D.WORKSPACE_2D
      CVS.needsUpdate = true
    }
  }
  #editing = true
  get editing() {
    return this.#editing
  }
  set editing(bool) {
    if (this.editing != bool) {
      this.#editing = bool
      const CVS = Canvas2D.WORKSPACE_2D
      CVS.needsUpdate = true
    }
  }
  remove() {
    const WIRE_INDEX = Wire.s.indexOf(this)
    if (0 <= WIRE_INDEX) Wire.s.splice(WIRE_INDEX, 1)
    
  }
}