import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export abstract class CardWithCategory<T> extends Card<T> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
  }

  set image(value: string) {
    this.imageElement.src = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
    this.categoryElement.classList.add(categoryClass);
  }
}