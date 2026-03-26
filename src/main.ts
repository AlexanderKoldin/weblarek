import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { BasketModel } from './components/Models/BasketModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { OrderModel } from './components/Models/OrderModel';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const order = new OrderModel(events);

events.onAll((event) => {
  console.log(`[Событие]: ${event.eventName}`, event.data);
});

api
  .getLotList()
  .then((items: IProduct[]) => {
    catalog.setItems(items);
    console.log('--- CatalogModel: Данные загружены ---');
    console.log('Список товаров:', catalog.getItems());

    if (catalog.items.length > 0) {
      const product = catalog.items[0];
      basket.add(product);
      console.log('--- BasketModel: Товар добавлен ---');
      console.log('В корзине товаров:', basket.getCount());
      console.log('Итоговая сумма:', basket.getTotal());
    }

    console.group('--- OrderModel: Тест валидации ---');
    order.setField('email', 'test@test.ru');
    order.setField('address', 'ул. Тестовая, д. 1');
    order.setField('payment', 'card');
    order.setField('phone', '+79990000000');

    const isValid = order.validateOrder();
    console.log('Данные заказа:', order.getOrderData());
    console.log('Результат валидации:', isValid ? 'Валидно' : 'Ошибка');
    console.log('Ошибки:', order.formErrors);
    console.groupEnd();

    console.log('Все компоненты модели и связи проверены!');
  })
  .catch((err) => {
    console.error('Ошибка инициализации приложения:', err);
  });
