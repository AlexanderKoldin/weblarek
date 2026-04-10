import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card<T = {}> extends Component<IProduct & T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);

    if (actions?.onClick) {
      container.addEventListener('click', actions.onClick);
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    this.setText(this._price, value !== null ? `${value} синапсов` : 'Бесценно');
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}
