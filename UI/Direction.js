export default class Direction {
  static #ANGLE_DELTA = Math.PI/4
  static #DIRECTIONS = [
    "E",
    "SE",
    "S",
    "SW",
    "W",
    "NW",
    "N",
    "NE",
  ]
  static initEnumlikeStaticsForDirections = (() => {
    let angle = 0 //deg
    for (let direction of this.#DIRECTIONS) {
      Object.defineProperty(Direction, direction, {
        value: angle,
        writable: false,
        enumerable: true,
        configurable: false
      })
      angle += this.#ANGLE_DELTA
    }
  })()
  static fromTwoPoints(A, B) {
    const DX = B.x - A.x,
          DY = A.y - B.y
    // tan(a) = DY/DX => a = atan(DY/DX)
    const ANGLE = - Math.atan2(DY, DX)
    return Direction.fromAngle(ANGLE)
  }
  static fromAngle(angle) {
    const DIRECTIONS_COUNT = Direction.#DIRECTIONS.length,
          INDEX = (Math.round(angle / Direction.#ANGLE_DELTA) + DIRECTIONS_COUNT) % DIRECTIONS_COUNT,
          DIRECTION_ID = Direction.#DIRECTIONS[INDEX]
    return Direction[DIRECTION_ID]
  }
  static isDiagonal(direction) {
    return 0 < direction % (Math.PI/2)
  }
}