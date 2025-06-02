addEventListener('wheel', (wheel) => wheel.preventDefault(), {passive: false})

const WIRE_CANVAS = document.querySelector('canvas-2d')
WIRE_CANVAS.addEventListener('wheel', function(wheel) {
  wheel.preventDefault()
  if (wheel.ctrlKey) {
  // Zoom Around Cursor
    const OLD_LOCAL = this.toLocal(wheel.clientX, wheel.clientY)
    const SCALE_FACTOR = Math.exp(-wheel.deltaY/100)
    const SCALE = this.scale *= SCALE_FACTOR
    // Offset To Keep Mouse At Same Location
    const NEW_LOCAL = this.toLocal(wheel.clientX, wheel.clientY)
    const DX = OLD_LOCAL.x - NEW_LOCAL.x,
          DY = OLD_LOCAL.y - NEW_LOCAL.y
    this.x -= DX * SCALE
    this.y -= DY * SCALE
    const NEW_NEW_LOCAL = this.toLocal(100, 100)
  } else {
  // Scroll
    const DX = -wheel.deltaX,
          DY = -wheel.deltaY
    this.x += DX
    this.y += DY
  }
}.bind(WIRE_CANVAS), {passive: false})

const CURSOR = document.querySelector('wire-cursor')
WIRE_CANVAS.addEventListener('pointermove', event => {
  const LOCAL_POSITION = WIRE_CANVAS.toLocal(event.clientX, event.clientY)
  CURSOR.x = LOCAL_POSITION.x
  CURSOR.y = LOCAL_POSITION.y
})

WIRE_CANVAS.addEventListener('pointerdown', event => {
  const CHOSEN_COMPONENT = 'resistor-component',
        NEW_COMPONENT = document.createElement(CHOSEN_COMPONENT)
  NEW_COMPONENT.addEventListener('initialized', () => {
    NEW_COMPONENT.start = event
    const ON_MOVE = event => {
      NEW_COMPONENT.end = event
    }
    addEventListener('pointermove', ON_MOVE)
    addEventListener('pointerup', event => {
      removeEventListener('pointermove', ON_MOVE)
    }, {once: true})
    WIRE_CANVAS.append(NEW_COMPONENT)

  }, {once: true})
})