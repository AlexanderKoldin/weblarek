import { IOrder, IOrderResult, IProduct, IProductList } from '../types';
import { Api } from './base/Api';

export interface ILarekApi {
  getLotList: () => Promise<IProduct[]>;
  orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  /**
   * @param cdn - Базовый путь до изображений
   * @param baseUrl - Базовый URL сервера
   * @param options - Опции запроса (заголовки и т.д.)
   */

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getLotList(): Promise<IProduct[]> {
    return this.get<IProductList>('/product').then((data) =>
      data.items.map((item) => ({
        ...item,

        image: this.cdn + item.image,
      })),
    );
  }

  orderLots(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>('/order', order);
  }
}
