import { IEvents } from './base/Events';
import { Form } from './base/Form';

interface IOrderForm {
  address: string;
  payment: string;
}

export class Order extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttons = Array.from(container.querySelectorAll('.button_alt'));

    this._buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.payment = button.name;
        this.onInputChange('payment', button.name);
      });
    });
  }

  set payment(name: string) {
    this._buttons.forEach((button) => {
      this.toggleClass(button, 'button_alt-active', button.name === name);
    });
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}
