import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {
  protected _items: IProduct[] = [];
  protected _selectedCard: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]) {
    this._items = items;
    this.events.emit('items:changed', this._items);
  }

  get items() {
    return this._items;
  }

  setPreview(item: IProduct) {
    this._selectedCard = item;
    this.events.emit('card:preview_changed', item);
  }

  get preview() {
    return this._selectedCard;
  }

  getSelectedCard() {
    return this._selectedCard;
  }
}
