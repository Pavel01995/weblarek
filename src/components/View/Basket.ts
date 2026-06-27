import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketView } from '../../types/index';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<IBasketView> {
    private listContainer: HTMLElement;
    private totalElement: HTMLElement;
    private button: HTMLButtonElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.listContainer = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', container);


        this.button.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set list(items: HTMLElement[]) {
        this.listContainer.replaceChildren(...items);
    }

    set total(price: number) {
        this.totalElement.textContent = `${price} синапсов`;
    }

    set locked(value: boolean) {
        this.button.disabled = value;
    }
}