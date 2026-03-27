import { FormErrors, IBuyer, IEvents } from '../../types';

export class OrderModel {
  protected order: IBuyer = {
    payment: '',
    address: '',
    email: '',
    phone: '',
  };

  constructor(protected events: IEvents) {}

  setField(field: keyof IBuyer, value: string): void {
    if (field === 'payment') {
      if (value === 'card' || value === 'cash' || value === '') {
        this.order[field] = value;
      }
    } else {
      this.order[field] = value;
    }

    this.events.emit('order:changed', this.order);
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

    this.events.emit('order:changed', this.order);
  }
}
