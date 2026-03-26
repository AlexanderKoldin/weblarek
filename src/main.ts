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
    console.group('CatalogModel: тест методов');
    catalog.setItems(items);
    console.log('setItems(items) -> getItems():', catalog.getItems());

    const itemsFromCatalog = catalog.getItems();
    console.log('getItems() -> количество:', itemsFromCatalog.length);

    const firstProduct = catalog.getProduct(itemsFromCatalog[0]?.id ?? '');
    console.log('getProduct(firstId) ->', firstProduct);

    const previewItem = itemsFromCatalog[1] ?? itemsFromCatalog[0] ?? null;
    catalog.preview = previewItem;
    console.log('preview = item -> catalog.preview:', catalog.preview);
    console.groupEnd();

    console.group('BasketModel: тест методов');
    const basketItemsInitial = basket.getItems();
    console.log('getItems() [initial] ->', basketItemsInitial);

    const fallbackProduct: IProduct = {
      id: 'fallback-id',
      description: 'fallback-description',
      image: '',
      title: 'fallback-title',
      category: 'fallback-category',
      price: null,
    };
    const itemForBasket = previewItem ?? fallbackProduct;

    basket.add(itemForBasket);
    console.log('add(item) -> getCount():', basket.getCount());
    console.log('add(item) -> hasItem(id):', basket.hasItem(itemForBasket.id));
    console.log('add(item) -> getItems():', basket.getItems());
    console.log('add(item) -> getTotal():', basket.getTotal());

    basket.remove(itemForBasket.id);
    console.log('remove(id) -> hasItem(id):', basket.hasItem(itemForBasket.id));
    console.log('remove(id) -> getCount():', basket.getCount());
    console.log('remove(id) -> getItems():', basket.getItems());
    console.log('remove(id) -> getTotal():', basket.getTotal());

    basket.add(itemForBasket);
    console.log('add(item) [before clear] -> getCount():', basket.getCount());

    basket.clear();
    console.log('clear() -> getItems():', basket.getItems());
    console.log('clear() -> getCount():', basket.getCount());
    console.log('clear() -> getTotal():', basket.getTotal());
    console.groupEnd();

    console.group('OrderModel: тест методов');
    order.setField('email', 'test@test.ru');
    console.log('setField(email, ...) -> getOrderData():', order.getOrderData());

    order.setField('address', 'ул. Тестовая, д. 1');
    console.log('setField(address, ...) -> getOrderData():', order.getOrderData());

    order.setField('payment', 'card');
    console.log('setField(payment, ...) -> getOrderData():', order.getOrderData());

    order.setField('phone', '+79990000000');
    console.log('setField(phone, ...) -> getOrderData():', order.getOrderData());

    const isValid = order.validateOrder();
    console.log('validateOrder() ->', isValid ? 'Валидно' : 'Ошибка');
    console.log('validateOrder() -> formErrors:', order.formErrors);

    console.log('getOrderData() ->', order.getOrderData());

    order.clearOrder();
    console.log('clearOrder() -> getOrderData():', order.getOrderData());
    console.log(
      'clearOrder() -> validateOrder():',
      order.validateOrder() ? 'Валидно' : 'Ошибка',
    );
    console.groupEnd();

    console.log('Все методы моделей покрыты тестовым стендом в консоли!');
  })
  .catch((err) => {
    console.error('Ошибка инициализации приложения:', err);
  });
