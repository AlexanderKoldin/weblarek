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
import { Page } from './components/Page';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('#modal-container')!, events);

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

events.on('items:changed', () => {
  page.catalog = catalogModel.items.map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

events.on('card:select', (item: IProduct) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (basketModel.hasItem(item.id)) {
        basketModel.remove(item.id);
      } else {
        basketModel.add(item);
      }
      card.button = basketModel.hasItem(item.id) ? 'Удалить из корзины' : 'Купить';
    },
  });

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
      button: basketModel.hasItem(item.id) ? 'Удалить из корзины' : 'Купить',
    }),
  });
});

events.on('basket:open', () => {
  modal.render({
    content: basketView.render(),
  });
});

events.on('basket:changed', () => {
  page.counter = basketModel.getCount();
  basketView.items = basketModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => basketModel.remove(item.id),
    });
    return card.render({
      title: item.title,
      price: item.price,
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
        onClick: () => {
          modal.close();
        },
      });

      modal.render({
        content: successView.render({
          total: result.total,
        }),
      });

      basketModel.clear();
      orderModel.clearOrder();
    })
    .catch((err) => {
      console.error(err);
    });
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

api
  .getLotList()
  .then((items) => {
    catalogModel.setItems(items);
  })
  .catch(console.error);
