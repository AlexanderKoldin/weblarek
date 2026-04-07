import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct & { button?: string; index?: string }> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _index?: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = container.querySelector('.card__image') || undefined;
    this._category = container.querySelector('.card__category') || undefined;
    this._description = container.querySelector('.card__text') || undefined;
    this._button = container.querySelector('.card__button') || undefined;
    this._index = container.querySelector('.basket__item-index') || undefined;

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this.title);
    }
  }

  set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);
    }
  }

  set description(value: string) {
    if (this._description) {
      this.setText(this._description, value);
    }
  }

  set index(value: string) {
    if (this._index) {
      this.setText(this._index, value);
    }
  }

  set button(value: string) {
    if (this._button) {
      this.setText(this._button, value);
    }
  }

  set price(value: number | null) {
    this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    if (this._button && value === null) {
      this.setDisabled(this._button, true);
    }
  }
}
