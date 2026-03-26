import { IProduct } from '../../types';

export class CatalogModel {
  protected _items: IProduct[] = [];
  protected _preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getProduct(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  set preview(item: IProduct | null) {
    this._preview = item;
  }

  get preview(): IProduct | null {
    return this._preview;
  }
}
