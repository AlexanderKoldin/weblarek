export interface IProdcut {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrederForm {
  payment: string;
  address: string;
}

export interface IContactForm {
  email: string;
  phone: string;
}

export interface I0rder extends IOrederForm, IContactForm {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}
