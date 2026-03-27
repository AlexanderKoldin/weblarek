import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { LarekApi } from './components/LarekApi';
import { BasketModel } from './components/Models/BasketModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { OrderModel } from './components/Models/OrderModel';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants'; // Добавили CDN_URL
import { mockProducts } from './utils/mocks';

const events = new EventEmitter();
const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const order = new OrderModel(events);

const api = new LarekApi(CDN_URL, API_URL);

events.onAll((event) => {
  console.log(`[Событие]: ${event.eventName}`, event.data);
});

const testModels = (items: IProduct[]) => {
  console.group('--- Тест моделей на МОКАХ ---');

  catalog.setItems(items);
  console.log('CatalogModel: данные установлены');

  const item1 = catalog.items[0];
  const item2 = catalog.items[1];

  if (item1 && item2) {
    basket.add(item1);
    basket.add(item2);
    console.log('Корзина после добавления 2-х товаров:', basket.getItems());
    console.log('Итоговая сумма:', basket.getTotal());

    basket.remove(item1.id);
    console.log(`После удаления ${item1.title}. Текущий список:`, basket.getItems());

    basket.clear();
    console.log('После clear(). Список покупок (ожидаем пустой):', basket.getItems());
  }

  order.setField('payment', 'card');
  order.setField('address', 'ул. Тестовая, д. 1');
  console.log('Данные заказа перед валидацией:', order.getOrderData());
  console.log('Ошибки (ожидаем email/phone):', order.validateOrder());

  console.groupEnd();
};

testModels(mockProducts);

console.group('--- Тест API: сетевой запрос ---');

api
  .getLotList()
  .then((items) => {
    console.log('Данные успешно получены с сервера:', items);

    catalog.setItems(items);

    console.log('Каталог в модели после обновления из API:', catalog.items);
    console.log('Сетевой тест завершен успешно!');
  })
  .catch((err) => {
    console.error('Ошибка при работе с API:', err);
  })
  .finally(() => {
    console.groupEnd();
  });
