const WIRE_CANVAS = document.querySelector('wire-canvas')
WIRE_CANVAS.addEventListener('wheel', function(wheel) {
  wheel.preventDefault()
  if (wheel.ctrlKey) {
  // Zoom
    const SCALE_FACTOR = Math.exp(-wheel.deltaY/100)
    this.scale *= SCALE_FACTOR
  } else {
  // Scroll
    const SCALE = this.scale
    const DX = -wheel.deltaX/SCALE,
          DY = -wheel.deltaY/SCALE
    this.x += DX
    this.y += DY
  }
}.bind(WIRE_CANVAS))