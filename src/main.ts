import { BasketModel } from './components/Models/BasketModel';
import { CatalogModel } from './components/Models/CatalogModel';
import './scss/styles.scss';
import { apiProducts } from './utils/data';

const catalog = new CatalogModel();
catalog.setItems(apiProducts.items);
console.log('Загружено товаров:', catalog.getItems().length);

const basket = new BasketModel();
const firstProduct = catalog.getItems()[0];

basket.add(firstProduct);

console.log('В корзине товаров:', basket.getCount());
console.log('Итоговая сумма:', basket.getTotal());

if (basket.hasItem(firstProduct.id)) {
  console.log('Товар успешно добавлен и найден в корзине!');
}
