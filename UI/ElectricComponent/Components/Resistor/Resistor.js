import ElectricComponent from '../../ElectricComponent.js';

class Resistor extends ElectricComponent {
  #createPath() {
    const WIDTH = .8, // [0, 1]
          HEIGHT = .2
    const NUMBER_OF_WIGGLES = 4
  }
}
customElements.define('resistor-component', Resistor)