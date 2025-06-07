export default class BaseElement extends HTMLElement {
  #init() {
    this.init?.bind(this)()
    const INIT_DONE_EVENT = new Event("initialized")
    this.dispatchEvent(INIT_DONE_EVENT)
  }
  constructor() {
    super()
    setTimeout(this.#init.bind(this))
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
  removeEventListener(...args) {
    const CALLBACK = args.find(arg => typeof arg == 'function'),
          TYPES = args.filter(arg => typeof arg == 'string'),
          OPTIONS = args.find(arg => typeof arg == 'object')
    for (let type of TYPES) super.removeEventListener(type, CALLBACK, OPTIONS)
  }
}