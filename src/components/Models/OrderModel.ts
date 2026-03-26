import { IContactForm, IEvents, IOrderForm } from '../../types';

export type IBuyer = IOrderForm & IContactForm;

export class OrderModel {
  formErrors: Partial<Record<keyof IBuyer, string>> = {};

  protected _order: IBuyer = {
    payment: '',
    address: '',
    email: '',
    phone: '',
  };

  constructor(protected events: IEvents) {}

  setField(field: keyof IBuyer, value: string): void {
    this._order[field] = value;

    this.validateOrder();
  }

  getOrderData() {
    return this._order;
  }

  validateOrder(): boolean {
    const errors: typeof this.formErrors = {};

    if (!this._order.address.trim()) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this._order.email.trim()) {
      errors.email = 'Необходимо указать email';
    }
    if (!this._order.phone.trim()) {
      errors.phone = 'Необходимо указать телефон';
    }
    if (!this._order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    this.formErrors = errors;

    this.events.emit('formErrors:changed', this.formErrors);

    return Object.keys(errors).length === 0;
  }

  clearOrder(): void {
    this._order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
    };
    this.formErrors = {};
  }
}
