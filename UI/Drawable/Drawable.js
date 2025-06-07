export default class Drawable {
  #children = []
  append(drawable) {
    if (drawable instanceof Drawable && !this.#children.includes(drawable)) {
      this.#children.push(drawable)
    }
  }
  draw(context) {
    for (let child of this.#children) {
      child.draw()
    }
  }
}