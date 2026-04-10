import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { Card } from './Card';

export class CardCatalog extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  protected categoryClasses: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    другое: 'card__category_other',
    дополнительное: 'card__category_additional',
    кнопка: 'card__category_button',
  };

  constructor(container: HTMLElement, events: IEvents) {
    super(container, {
      onClick: () => events.emit('card:select', { id: this.id }),
    });
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
