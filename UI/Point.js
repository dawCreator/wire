import Direction from './Direction.js'

export default class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  equals(point) {
    return this.x == point.x && this.y == point.y
  }
  stepInDirectionFor(direction, steps = 1) {
    const DX = Math.round(Math.cos(direction)) * steps,
          DY = Math.round(Math.sin(direction)) * steps
    return new Point(this.x + DX, this.y + DY)
  }
  insideRect(rect) {
    return this.x <= rect.X && this.y <= rect.Y && rect.x <= this.x && rect.y <= this.y
  }
  onPath(path) {
    return path.some(point => this.equals(point))
  }
}