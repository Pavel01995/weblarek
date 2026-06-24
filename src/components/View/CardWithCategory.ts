import { Card } from './Card';
import { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';

export abstract class CardWithCategory<T> extends Card<T> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
  }

  set image(value: string) {
    if (this.imageElement) {
      this.imageElement.src = value;
    }
  }

  set category(value: string) {
    if (this.categoryElement) {
     
      this.categoryElement.textContent = value;

      this.categoryElement.className = 'card__category';

     
      const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';


      this.categoryElement.classList.add(categoryClass);
    }
  }
}