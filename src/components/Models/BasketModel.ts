import { IProduct } from '../../types';

export class BasketModel {
  protected _items: IProduct[] = [];

  add(item: IProduct): void {
    this._items.push(item);
  }

  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  clear(): void {
    this._items = [];
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
