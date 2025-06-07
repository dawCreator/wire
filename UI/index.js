import Wire from './Drawable/Drawables/Wire.js'

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
  } else {
  // Scroll
    const DX = -wheel.deltaX,
          DY = -wheel.deltaY
    this.x += DX
    this.y += DY
    
    CURSOR.update(wheel)
  }
}.bind(WIRE_CANVAS), {passive: false})
const CURSOR = document.querySelector('wire-cursor')
WIRE_CANVAS.addEventListener('pointermove', move => CURSOR.update(move))
WIRE_CANVAS.addEventListener('pointerdown', down => new Wire(down))
// WIRE_CANVAS.addEventListener('pointerdown', event => {
//   const CHOSEN_COMPONENT = 'resistor-component',
//         NEW_COMPONENT = document.createElement(CHOSEN_COMPONENT)
//   NEW_COMPONENT.addEventListener('initialized', () => {
//     NEW_COMPONENT.position = event
//     const ON_MOVE = event => {
//       NEW_COMPONENT.direction = event
//     }
//     addEventListener('pointermove', ON_MOVE)
//     addEventListener('pointerup', event => {
//       removeEventListener('pointermove', ON_MOVE)
//     }, {once: true})
//     WIRE_CANVAS.append(NEW_COMPONENT)

//   }, {once: true})
// })

const ACTIVE_COMPONENT_BUTTON = document.querySelector('#activeComponent'),
      COMPONENT_MENU = document.querySelector('#componentMenu')
ACTIVE_COMPONENT_BUTTON.addEventListener('on', () => COMPONENT_MENU.show())
ACTIVE_COMPONENT_BUTTON.addEventListener('off', () => COMPONENT_MENU.hide())

// GLOBAL KEY COMMANDS
addEventListener('keydown', keydown => {
  const KEY = keydown.key
  switch (KEY) {
    case 'Backspace':
      for (let wire of Wire.selected) {
        wire.remove()
      }
      WIRE_CANVAS.needsUpdate = true
    default: 
      console.log(KEY)
  }
})