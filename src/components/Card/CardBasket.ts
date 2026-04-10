import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CardBasket extends Card<{ index: string }> {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);

    this._button.addEventListener('click', () => {
      events.emit('card:remove', { id: this.id });
    });
  }

  set index(value: string) {
    this.setText(this._index, value);
  }
}
