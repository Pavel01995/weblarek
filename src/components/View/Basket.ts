import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketView } from '../../types/index';

export class Basket extends Component<IBasketView> {
    private listContainer: HTMLElement;
    private totalElement: HTMLElement;
    private button: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

       
        this.listContainer = container.querySelector('.basket__list') as HTMLElement;
        this.totalElement = container.querySelector('.basket__price') as HTMLElement;
        this.button = container.querySelector('.basket__button') as HTMLButtonElement;

      
        if (this.button) {
            this.button.addEventListener('click', () => {
                this.events.emit('order:open');
            });
        }
    }


    set list(items: HTMLElement[]) {
        if (items.length > 0) {
            this.listContainer.replaceChildren(...items);
        } else {
            this.listContainer.replaceChildren(document.createTextNode('Корзина пуста'));
        }
    }


    set total(price: number) {
        this.totalElement.textContent = `${price} синапсов`;
    }

 
    set locked(value: boolean) {
        if (this.button) {
            this.button.disabled = value;
        }
    }
}