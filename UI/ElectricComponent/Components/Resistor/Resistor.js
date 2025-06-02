import ElectricComponent from '../../ElectricComponent.js';

class Resistor extends ElectricComponent {
  set start(event) {
    const CANVAS = document.querySelector('canvas-2d')
    const LOCAL_POSITION = CANVAS.toLocal(event)
    this.x = LOCAL_POSITION.x
    this.y = LOCAL_POSITION.y
  }
  set end(event) {
    
  }
}
customElements.define('resistor-component', Resistor)