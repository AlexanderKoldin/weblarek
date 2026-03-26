export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrderForm {
  payment: string;
  address: string;
}

export interface IContactForm {
  email: string;
  phone: string;
}

export interface IOrder extends IOrderForm, IContactForm {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}
