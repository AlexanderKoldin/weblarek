import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { BasketModel } from './components/Models/BasketModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { OrderModel } from './components/Models/OrderModel';
import { IBuyer, IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';

import { Modal } from './components/base/Modal';
import { Success } from './components/base/Success';
import { Basket } from './components/Basket';

import { CardBasket, CardCatalog, CardPreview } from './components/Card';
import { Contacts } from './components/Contacts';
import { Order } from './components/Order';

import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const header = new Header(document.querySelector('.header')!, events);
const gallery = new Gallery(document.querySelector('.gallery')!);
const modal = new Modal(document.querySelector('#modal-container')!, events);
const pageWrapper = document.querySelector('.page__wrapper')!;

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new Order(cloneTemplate(orderTemplate), events);
const contactsView = new Contacts(cloneTemplate(contactsTemplate), events);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => events.emit('card:toBasket'),
});

events.on('items:changed', () => {
  gallery.items = catalogModel.items.map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => catalogModel.setPreview(item),
    });
    return card.render(item);
  });
});

events.on('card:preview_changed', (item: IProduct) => {
  modal.render({
    content: cardPreview.render({
      ...item,
      button: basketModel.hasItem(item.id) ? 'Удалить из корзины' : 'Купить',
    }),
  });
});

events.on('card:toBasket', () => {
  const item = catalogModel.getSelectedCard();
  if (item && item.price !== null) {
    if (basketModel.hasItem(item.id)) {
      basketModel.remove(item.id);
    } else {
      basketModel.add(item);
    }

    cardPreview.render({
      ...item,
      button: basketModel.hasItem(item.id) ? 'Удалить из корзины' : 'Купить',
    });
  }
});

events.on('basket:open', () => {
  modal.render({
    content: basketView.render(),
  });
});

events.on('basket:changed', () => {
  header.counter = basketModel.getCount();
  basketView.items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => basketModel.remove(item.id),
    });
    return card.render({
      ...item,
      index: (index + 1).toString(),
    });
  });
  basketView.total = basketModel.getTotal();
});

events.on('order:open', () => {
  modal.render({
    content: orderView.render({
      address: '',
      payment: '',
      valid: false,
      errors: '',
    }),
  });
});

events.on('formErrors:change', (errors: Partial<IBuyer>) => {
  const { payment, address, email, phone } = errors;
  orderView.valid = !payment && !address;
  orderView.errors = [payment, address].filter(Boolean).join('; ');

  contactsView.valid = !email && !phone;
  contactsView.errors = [email, phone].filter(Boolean).join('; ');
});

events.on(/^order\..*:change|^contacts\..*:change/, (data: { field: keyof IBuyer; value: string }) => {
  orderModel.setField(data.field, data.value);
  if (data.field === 'payment') orderView.payment = data.value;
});

events.on('order:submit', () => {
  modal.render({
    content: contactsView.render({
      email: '',
      phone: '',
      valid: false,
      errors: '',
    }),
  });
});

events.on('contacts:submit', () => {
  const orderData = {
    ...orderModel.getOrderData(),
    items: basketModel.getItems().map((item) => item.id),
    total: basketModel.getTotal(),
  };

  api
    .orderLots(orderData)
    .then((result) => {
      const successView = new Success(cloneTemplate(successTemplate), {
        onClick: () => modal.close(),
      });
      modal.render({
        content: successView.render({ total: result.total }),
      });
      basketModel.clear();
      orderModel.clearOrder();
    })
    .catch(console.error);
});

events.on('modal:open', () => pageWrapper.classList.add('page__wrapper_locked'));
events.on('modal:close', () => pageWrapper.classList.remove('page__wrapper_locked'));

api
  .getLotList()
  .then((items) => catalogModel.setItems(items))
  .catch(console.error);
