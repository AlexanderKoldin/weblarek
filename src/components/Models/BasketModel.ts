import { IEvents, IProduct } from '../../types';

export class BasketModel {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  add(item: IProduct): void {
    this.items.push(item);
    this.events.emit('basket:changed', { items: this.items });
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('basket:changed', { items: this.items });
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:changed', { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
