import { Component } from './Component';
import { IEvents } from './Events';

interface IModalData {
  content: HTMLElement | null;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this._content = container.querySelector('.modal__content') as HTMLElement;

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));

    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement | null) {
    if (value) {
      this._content.replaceChildren(value);
    } else {
      this._content.innerHTML = '';
    }
  }

  open() {
    this.toggleClass(this.container, 'modal_active', true);
    this.events.emit('modal:open');
  }

  close() {
    this.toggleClass(this.container, 'modal_active', false);
    this.content = null;
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}
