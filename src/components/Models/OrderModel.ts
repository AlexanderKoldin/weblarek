import { IContactForm, IOrderForm } from '../../types';

export class OrderModel {
  protected _order: IOrderForm & IContactForm = {
    payment: '',
    address: '',
    email: '',
    phone: '',
  };

  setField(field: keyof (IOrderForm & IContactForm), value: string): void {
    this._order[field] = value;
  }

  getOrderData() {
    return this._order;
  }

  validate(): boolean {
    return Object.values(this._order).every((value) => value.trim().lenght > 0);
  }
}
