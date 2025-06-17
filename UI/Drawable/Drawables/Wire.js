import Drawable from '../Drawable.js'
import Direction from '../../Direction.js'
import Canvas2D from '../../Canvas2D/Canvas2D.js'
import Node from './Node.js'

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
    let i = 0
    for (let wire of Wire.visible) {
      console.log(`${i++}:\t${wire.start?.x},${wire.start?.y}:${wire.end?.x},${wire.end?.y}`)
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
  static createFromEvent(event) {
    // Check If Clicked On Node
    const POSITION = Canvas2D.WORKSPACE_2D.toGrid(event.x, event.y),
          NODE = Node.atPosition(POSITION),
          NODE_IS_OPEN = NODE?.connections.length == 1
    if (NODE_IS_OPEN) {
    // Extend Existing Wire
      const EXISTING_WIRE = NODE.connections[0]
      EXISTING_WIRE.handleDown(event)
    } else {
    // Split Wires Clicked On
      const INTERSECTING_WIRES = Wire.findIntersecting(POSITION)
      for (let intersectingWire of INTERSECTING_WIRES) intersectingWire.split(POSITION)
    // Create New Wire
      const NEW_WIRE = new Wire()
      NEW_WIRE.handleDown(event)
    }
  }
  static findIntersecting(point) {
    return Wire.visible.filter(wire => wire.intersectingPoint(point))
  }
  #points = []
  get points() {
    return this.#points
  }
  set points(points) {
    const OLD_END_NODE = this.endNode,
          OLD_START_NODE = this.startNode
    this.#points = []
    this.#boundingClientRect = {x: Infinity, y: Infinity, X: -Infinity, Y: -Infinity}
    for (let point of points) this.addPoint(point)
    if (OLD_END_NODE != this.endNode) OLD_END_NODE?.disconnect(this)
    if (OLD_START_NODE != this.startNode) OLD_START_NODE?.disconnect(this)
  }
  #reverse() {
    this.#points.reverse()
  }
  #boundingClientRect = {x: Infinity, y: Infinity, X: -Infinity, Y: -Infinity}
  get boundingClientRect() {
    return this.#boundingClientRect
  }
  #updateBoundingClientRect = function(...points) {
    const LINE_WIDTH_OFFSET = Wire.LINE_WIDTH/2
    for (let point of points) {
      this.#boundingClientRect.x = Math.min(this.#boundingClientRect.x, point.x - LINE_WIDTH_OFFSET) 
      this.#boundingClientRect.y = Math.min(this.#boundingClientRect.y, point.y - LINE_WIDTH_OFFSET)
      this.#boundingClientRect.X = Math.max(this.#boundingClientRect.X, point.x + LINE_WIDTH_OFFSET)
      this.#boundingClientRect.Y = Math.max(this.#boundingClientRect.Y, point.y + LINE_WIDTH_OFFSET)
    }
  }.bind(this)
  addPoint = function(point) {
    this.endNode?.disconnect(this)
    const POINTS = this.#points,
          POINT_INDEX = POINTS.findIndex(p => point.equals(p)),
          POINT_ALREADY_EXISTS = POINT_INDEX != -1
    if (POINT_ALREADY_EXISTS) {
    // Remove All Points Until This Point & Update Bounds
      const NOT_LAST_POINT = POINT_INDEX < POINTS.length
      if (NOT_LAST_POINT) this.points = POINTS.slice(0, POINT_INDEX + 1)
    } else {
    // Append New Point And Update Bounds
      POINTS.push(point)
      this.#updateBoundingClientRect(point)
    }
    new Node(point, this)
    Canvas2D.WORKSPACE_2D.needsUpdate = true
  }.bind(this)
  get start() {
    return this.#points[0]
  }
  get end() {
    if (this.#points.length > 1) return this.#points[this.#points.length-1]
  }
  get startNode() {
    const START = this.start
    if (START) return Node.atPosition(START)
  }
  get endNode() {
    const END_POSITION = this.end
    if (END_POSITION) return Node.atPosition(END_POSITION)
  }
  join(wire) {
    // Bring Points In Order
    const CONNECTED_AT_START = this.startNode.connections.some(component => wire === component)
    if (CONNECTED_AT_START) this.#reverse() // Now Connected At End
    const NEW_POINTS = wire.points,
          NEW_POINTS_NEED_REVERSAL = wire.end.equals(this.end)
    if (NEW_POINTS_NEED_REVERSAL) NEW_POINTS.reverse()
    // Add New Points
    let point
    for (let index = 1; index < NEW_POINTS.length; index++) {
      point = NEW_POINTS[index]
      this.addPoint(point)
    }
    // Delete Joined Wire
    wire.remove()
  }
  split(position) {
    const SPLIT_INDEX = this.#points.findIndex(p => p.equals(position)),
          SPLIT_VALID = SPLIT_INDEX > 0 && SPLIT_INDEX < this.#points.length - 1
    if (SPLIT_VALID) {
      console.log(`SPLITTING WIRE ${this.start.x},${this.start.y}:${this.end.x},${this.end.y} at ${position.x},${position.y}`)
      console.log(SPLIT_INDEX, this.points)
      const POINTS_BEFORE_SPLIT = this.#points.slice(0, SPLIT_INDEX+1),
            POINTS_AFTER_SPLIT = this.#points.slice(SPLIT_INDEX)
      new Wire(POINTS_AFTER_SPLIT)
      this.points = POINTS_BEFORE_SPLIT
    }
  }
  constructor(points = []) {
    super()
    this.points = points
    Wire.s.push(this)
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
    const WORKSPACE_2D = Canvas2D.WORKSPACE_2D,
          POSITION = WORKSPACE_2D.toGrid(down.x, down.y),
          IS_NEW_WIRE = this.#points.length == 0
    if (IS_NEW_WIRE) {
      this.addPoint(POSITION)
      new Node(POSITION, this)
    } else {
    // Existing Wire Was Clicked At One Of It's Ends
      const WAS_CLICKED_ON_START = POSITION.equals(this.start)
      if (WAS_CLICKED_ON_START) this.#reverse()
    }
    WORKSPACE_2D.addEventListener('pointermove', this.handleMove)
    WORKSPACE_2D.addEventListener('pointerleave', 'pointerup', 'pointercancel', this.handleUp)
  }.bind(this)
  handleMove = function(move) {
    const CVS = move.target,
          CURSOR = CVS.toLocal(move.x, move.y),
          END_POINT = CVS.toGrid(move.x, move.y)
    let lastPoint = this.end || this.start
    if (!END_POINT.equals(lastPoint)) {
    // New End-Point
      let direction, lastDirection
    // Add New Points
      do {
        direction = Direction.fromTwoPoints(lastPoint, CURSOR)
        if (Direction.opposing(direction) == lastDirection) break
        lastDirection = direction
        lastPoint = lastPoint.stepInDirectionFor(direction)
        this.addPoint(lastPoint)
      } while (!END_POINT.equals(lastPoint))
    }
  }.bind(this)
  handleUp = function() {
    if (this.#points.length <= 1) this.remove()
    this.editing = false
    
    const END_NODE = this.endNode,
          CONNECTIONS = END_NODE?.connections
    if (CONNECTIONS?.length == 1) {
    // Test If END_NODE On Wire => Split
      const END = this.end,
            INTERSECTING_WIRES = Wire.findIntersecting(END)
      for (let intersectingWire of INTERSECTING_WIRES) {
        if (intersectingWire !== this) intersectingWire.split(END)
      } 
    } else if (CONNECTIONS?.length == 2) {
      const [WIRE_A, WIRE_B] = CONNECTIONS
      WIRE_A.join(WIRE_B)
    }

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
  #editing
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
    if (0 <= WIRE_INDEX) {
      Wire.s.splice(WIRE_INDEX, 1)
      this.startNode.disconnect(this)
      this.endNode?.disconnect(this)
    }
  }
}