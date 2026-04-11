import { ensureElement } from '../../utils/utils';
import { ICardActions } from './Card';
import { CardCatalog } from './CardCatalog';

export class CardPreview extends CardCatalog {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);

    this._description = ensureElement<HTMLElement>('.card__text', container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);
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
