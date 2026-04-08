import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
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
}

export class CardCatalog<T = {}> extends Card<T> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  protected categoryClasses: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    другое: 'card__category_other',
    дополнительное: 'card__category_additional',
    кнопка: 'card__category_button',
  };

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._image = ensureElement<HTMLImageElement>('.card__image', container);
    this._category = ensureElement<HTMLElement>('.card__category', container);
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set category(value: string) {
    this.setText(this._category, value);

    Object.values(this.categoryClasses).forEach((cls) => {
      this.toggleClass(this._category, cls, false);
    });

    const categoryKey = value.toLowerCase();
    const cls = this.categoryClasses[categoryKey] || 'card__category_other';
    this.toggleClass(this._category, cls, true);
  }
}

export class CardPreview extends CardCatalog<{ button: string; description: string }> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._description = ensureElement<HTMLElement>('.card__text', container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);

    if (actions?.onClick) {
      container.removeEventListener('click', actions.onClick);
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  set button(value: string) {
    this.setText(this._button, value);
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this.setText(this._button, 'Недоступно');
      this.setDisabled(this._button, true);
    } else {
      this.setDisabled(this._button, false);
    }
  }
}

export class CardBasket extends Card<{ index: string }> {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);

    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }

  set index(value: string) {
    this.setText(this._index, value);
  }
}
