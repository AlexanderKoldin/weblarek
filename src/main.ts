import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { BasketModel } from './components/Models/BasketModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { OrderModel } from './components/Models/OrderModel';
import { IProduct } from './types';
import { mockProducts } from './utils/mocks';

const events = new EventEmitter();
const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const order = new OrderModel(events);

events.onAll((event) => {
  console.log(`[Событие]: ${event.eventName}`, event.data);
});

const testModels = (items: IProduct[]) => {
  console.group('CatalogModel: тест методов');
  catalog.setItems(items);

  console.log('setItems(items) -> items:', catalog.items);

  const itemsFromCatalog = catalog.items;
  console.log('items -> количество:', itemsFromCatalog.length);

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

  basket.add(itemForBasket);
  basket.clear();
  console.log('clear() -> getCount после очистки:', basket.getCount());
  console.groupEnd();

  console.group('OrderModel: тест методов');
  order.setField('email', 'test@test.ru');
  order.setField('address', 'ул. Тестовая, д. 1');
  order.setField('payment', 'card');
  order.setField('phone', '+79990000000');

  const errors = order.validateOrder();
  const isValid = Object.keys(errors).length === 0;

  console.log('validateOrder() ->', isValid ? 'Валидно' : 'Ошибка');
  console.log('validateOrder() -> тексты ошибок (если есть):', errors);

  order.clearOrder();
  console.log('clearOrder() -> данные после очистки:', order.getOrderData());
  console.groupEnd();

  console.log('Все методы моделей покрыты тестовым стендом на МОКОВЫХ данных!');
};

testModels(mockProducts);
