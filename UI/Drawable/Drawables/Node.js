import Drawable from '../Drawable.js'

export default class Node extends Drawable {
  static #s = new Map()
  static get s() {
    return Array.from(this.#s.values())
  }
  static get crossings() {
    return Node.s.filter(node => node.connections.length > 2)
  }
  static key(position) {
    return `${position.x},${position.y}`
  }
  static atPosition(position) {
    const KEY = Node.key(position)
    return Node.#s.get(KEY)
  }
  static draw(context) {
    context.beginPath()
    context.lineWidth = .08
    context.strokeStyle = '#555'
    for (let node of Node.s) {
      node.draw(context)
    }
    context.stroke()
    context.fill()
    context.beginPath()
    context.fillStyle = '#555'
    for (let node of Node.crossings) {
      node.draw(context)
    }
    context.fill()
  }
  constructor(position, component) {
    super()

    const EXISTING_NODE = Node.atPosition(position)
    if (EXISTING_NODE) {
      EXISTING_NODE.connect(component)
    } else {
      const KEY = Node.key(position)
      Node.#s.set(KEY, this)
      this.x = position.x
      this.y = position.y
      this.connect(component)
    }
  }
  #connections = []
  get connections() {
    return this.#connections
  }
  connect(component) {
    if (!this.#connections.includes(component)) this.#connections.push(component)
  }
  disconnect(component) {
    const CONNECTIONS = this.#connections,
          CONNECTION_INDEX = CONNECTIONS.indexOf(component),
          CONNECTION_EXISTS = CONNECTION_INDEX != -1
    if (CONNECTION_EXISTS) {
    // Remove Existing Connection
      CONNECTIONS.splice(CONNECTION_INDEX, 1)
      switch (CONNECTIONS.length) {
        case 0:
          this.remove()
          break
        case 2:
          const [WIRE_ONE, WIRE_TWO] = CONNECTIONS
          WIRE_ONE.join(WIRE_TWO)
          break
        default:
      }
    }
  }
  #RADIUS = .08
  draw(context) {
    const CONNECTION_COUNT = this.#connections.length
    if (CONNECTION_COUNT === 2) return 
    context.moveTo(this.x + this.#RADIUS, this.y) 
    context.arc(this.x, this.y, this.#RADIUS, 0, 2 * Math.PI)
  }
  remove() {
    const POSITION = {x: this.x, y: this.y},
          KEY = Node.key(POSITION)
    Node.#s.delete(KEY)
  }
}