import Drawable from '../Drawable.js'

export default class Node extends Drawable {
  static #s = new Map()
  static get s() {
    return Array.from(this.#s.values())
  }
  static atPosition(position) {
    const KEY = `${position.x},${position.y}`
    return Node.#s.get(KEY)
  }
  static draw(context) {
    context.beginPath()
    for (let node of Node.s) {
      node.draw()
    }
    context.stroke()
    context.fill()
  }
  constructor(position) {
    super()

    this.x = position.x
    this.y = position.y

    const KEY = `${position.x},${position.y}`
    Node.#s.set(KEY, this)
  }
  #connections = []
  get connections() {
    return this.#connections
  }
  draw(context) {
    const count = this.connections.length
    if (count === 2) return // keine Darstellung
  
    const cx = this.x
    const cy = this.y
    const r = 0.2
  
    context.moveTo(cx + r, cy) // wichtig, damit path geschlossen wird
    context.arc(cx, cy, r, 0, 2 * Math.PI)
  
    if (count > 2) {
      context.closePath() // wird für fill benötigt
    }
  }
}