import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ICardBasketView } from '../../types';

export class CardBasket extends Card<ICardBasketView> {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement; 

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.indexElement = container.querySelector('.card__index') as HTMLElement;
    this.deleteButton = container.querySelector('.card__button') as HTMLButtonElement;


    if (this.deleteButton) {
      this.deleteButton.addEventListener('click', () => {
        this.events.emit('card:remove', { card: this });
      });
    }
  }


  set index(value: number) {
    if (this.indexElement) {
      this.indexElement.textContent = String(value);
    }
  }
}