import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Card<T> extends Component<T> {
    protected events: IEvents;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        
      super(container);
        this.events = events;

        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
    }

 

    set title(value: string) {
        if (this.titleElement) {
            this.titleElement.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this.priceElement) {
            if (value === null) {
                this.priceElement.textContent = 'Бесценно';
            } else {
                this.priceElement.textContent = `${value} синапсов`;
            }
        }
    }
}