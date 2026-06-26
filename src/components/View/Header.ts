import { Component } from '../base/Component';
import { IEvents } from '../base/Events'; // Не забываем импорт рации
import { IHeader } from '../../types/index';



export class Header extends Component<IHeader> {
    private buttonElement: HTMLButtonElement;
    private counterElement: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;



        this.buttonElement = container.querySelector('.header__basket') as HTMLButtonElement;
        this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;


        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', () => {

                this.events.emit('basket:open');
            });
        }
    }

    set counter(value: number) {
        if (this.counterElement) {
            this.counterElement.textContent = String(value);
        }
    }
}