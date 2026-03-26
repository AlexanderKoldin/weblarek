import { IEvents, IProduct } from '../../types';

export class CatalogModel {
  protected _items: IProduct[] = [];
  protected _preview: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this._items = items;

    this.events.emit('items:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  get items(): IProduct[] {
    return this._items;
  }

  getProduct(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  set preview(item: IProduct | null) {
    this._preview = item;
    if (item) {
      this.events.emit('card:select', { item });
    }
  }

  get preview(): IProduct | null {
    return this._preview;
  }
}
