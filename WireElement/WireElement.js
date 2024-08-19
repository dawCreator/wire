export default class WireElement extends HTMLElement {
  constructor() {
    super()
    setTimeout(this.init?.bind(this))
  } 
  connectedCallback() {
    const CONNECTED_EVENT = new CustomEvent('appended')
    this.dispatchEvent(CONNECTED_EVENT)
  }
  addEventListener(...args) {
    const CALLBACK = args.find(arg => typeof arg == 'function'),
          TYPES = args.filter(arg => typeof arg == 'string'),
          OPTIONS = args.find(arg => typeof arg == 'object')
    for (let type of TYPES) super.addEventListener(type, CALLBACK, OPTIONS)
    return CALLBACK
  }
}