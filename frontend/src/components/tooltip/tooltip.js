import css from './tooltip.scss';
import resetCss from '../../styles/reset.scss';
import variablesCss from '../../styles/variables.scss';

class Tooltip extends HTMLElement {
  connectedCallback() {
    this.createTooltip();
  }

  createTooltip() {
    const template = this.createTemplate();

    this.attachShadow({ mode: 'open' }).appendChild(
      template.content.cloneNode(true)
    );

    this.tooltipContainer = this.shadowRoot.querySelector('#tooltip-container');
    this.root = this.shadowRoot.querySelector('#root');

    this.setStyle();
    this.setListeners();
  }

  createTemplate = () => {
    const template = document.createElement('template');

    const rootElement = document.createElement('button');
    rootElement.classList.add('root');
    rootElement.id = 'root';

    const tooltipContainer = document.createElement('div');
    tooltipContainer.classList.add('container');
    tooltipContainer.id = 'tooltip-container';

    const arrow = document.createElement('arrow');
    arrow.classList.add('arrow');

    const tooltipContentSlot = document.createElement('slot');
    tooltipContentSlot.name = 'tooltip-content';

    const slot = document.createElement('slot');
    slot.name = 'content';

    rootElement.append(slot, tooltipContainer);
    tooltipContainer.append(arrow, tooltipContentSlot);

    template.content.append(rootElement);

    return template;
  };

  setStyle() {
    const style = document.createElement('style');
    style.textContent = css + resetCss + variablesCss;

    this.shadowRoot.appendChild(style);
  }

  setListeners() {
    this.root.addEventListener('click', this.handleClick);
  }

  handleClick = (event) => {
    event?.stopPropagation();

    if (this.isShowing) {
      this.tooltipContainer.classList.remove('show');
      this.isShowing = false;
      this.removeOutsideClickListener();
    } else {
      this.tooltipContainer.classList.add('show');
      this.isShowing = true;
      this.setOutsideClickListener();
    }
  };

  setOutsideClickListener() {
    document.body.addEventListener('click', this.handleClickOutside);
  }

  removeOutsideClickListener() {
    document.body.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = () => {
    if (this.isShowing) {
      this.handleClick();
    }
  };
}

customElements.define('tool-tip', Tooltip);
