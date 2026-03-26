import { IEvents, IProduct } from '../../types';

export class BasketModel {
  protected _items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  add(item: IProduct): void {
    this._items.push(item);

    this.events.emit('basket:changed', { items: this._items });
  }

  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);

    this.events.emit('basket:changed', { items: this._items });
  }

  clear(): void {
    this._items = [];

    this.events.emit('basket:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getTotal(): number {
    return this._items.reduce((acc, item) => acc + (item.price || 0), 0);
  }

  getCount(): number {
    return this._items.length;
  }

  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
