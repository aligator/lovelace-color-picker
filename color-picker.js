import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
import "https://cdn.jsdelivr.net/npm/reinvented-color-wheel@0.4.0/webcomponents/index.js";

class ColorPicker extends LitElement {
  constructor() {
    super();
    this.selectedColor = [255, 0, 0];
  }

  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  render() {
    return html`
    <ha-card>
      <div class="aligator-color-picker-center-container">
        <div class="aligator-color-picker-container">
          <reinvented-color-wheel
            @change="${this._selectColor}"
            rgb="${(this.selectedColor || [255, 0, 0]).join(",")}"
            wheel-diameter="200"
            wheel-thickness="20"
            handle-diameter="16"
            wheel-reflects-saturation="true">
          </reinvented-color-wheel>
          <div class="aligator-color-picker-buttons-container">
            ${this.config.entities.map(entity => {
              const stateObj = this.hass.states[entity];
              return stateObj
                ? html`<mwc-button outlined @click="${() => this._setColor(entity)}">${stateObj.attributes.friendly_name}</mwc-button>`
                : html` <div class="not-found">Entity ${ent} not found.</div> `;
              })
            }
          </div>
        </div>
      </div>
    </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error("You need to define entities");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 200/50 + this.config.entities.length;
  }

  _selectColor(state) {
    this.selectedColor = state.detail._rgb
  }

  _setColor(entity_id) {
    this.hass.callService("text", "set_value", {
      entity_id: entity_id,
      value: `${this.selectedColor.join(",")}`
    });
  }

  static get styles() {
    return css`
    .aligator-color-picker-center-container {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }
    .aligator-color-picker-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .aligator-color-picker-buttons-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    `;
  }
}
customElements.define("color-picker", ColorPicker);