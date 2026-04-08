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
      this.order[field] = value as IBuyer['payment'];
    } else {
      this.order[field] = value;
    }

    const errors = this.validateOrder();
    this.formErrors = errors;
    this.events.emit('formErrors:change', errors);
  }

  getOrderData(): IBuyer {
    return this.order;
  }

  validateOrder(): FormErrors {
    const errors: FormErrors = {};

    if (!this.order.address.trim()) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.email.trim()) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone.trim()) {
      errors.phone = 'Необходимо указать телефон';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    return errors;
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
