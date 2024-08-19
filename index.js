addEventListener('wheel', (wheel) => wheel.preventDefault(), {passive: false})

const WIRE_CANVAS = document.querySelector('wire-canvas')
WIRE_CANVAS.addEventListener('wheel', function(wheel) {
  wheel.preventDefault()
  if (wheel.ctrlKey) {
  // Zoom
    const SCALE_FACTOR = Math.exp(-wheel.deltaY/100)
    this.scale *= SCALE_FACTOR
  } else {
  // Scroll
    const DX = -wheel.deltaX,
          DY = -wheel.deltaY
    this.x += DX
    this.y += DY
  }
}.bind(WIRE_CANVAS), {passive: false})