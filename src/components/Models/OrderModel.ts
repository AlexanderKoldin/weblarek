import { FormErrors, IBuyer, IEvents } from '../../types';

export class OrderModel {
  protected order: IBuyer = {
    payment: '',
    address: '',
    email: '',
    phone: '',
  };

  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {}

  setField(field: keyof IBuyer, value: string): void {
    if (field === 'payment') {
      if (value === 'card' || value === 'cash' || value === '') {
        this.order[field] = value;
      }
    } else {
      this.order[field] = value;
    }

    this.validateOrder();
  }

  getOrderData(): IBuyer {
    return this.order;
  }

  validateOrder() {
    const errors: FormErrors = {};

    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.address || this.order.address.trim().length === 0) {
      errors.address = 'Необходимо указать адрес доставки';
    }

    if (!this.order.email || this.order.email.trim().length === 0) {
      errors.email = 'Необходимо указать Email';
    } else if (!/^\S+@\S+\.\S+$/.test(this.order.email)) {
      errors.email = 'Неправильный формат Email';
    }

    if (!this.order.phone || this.order.phone.trim().length === 0) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!/^\+?[0-9\s\-()]+$/.test(this.order.phone)) {
      errors.phone = 'Неправильный формат телефона';
    }

    this.formErrors = errors;

    this.events.emit('formErrors:change', errors);

    if (Object.keys(errors).length === 0) {
      this.events.emit('order:ready', this.order);
    }

    return Object.keys(errors).length === 0;
  }

  clearOrder(): void {
    this.order = {
      payment: '',
      address: '',
      email: '',
      phone: '',
    };
    this.formErrors = {};
    this.events.emit('order:changed', this.order);
  }
}
