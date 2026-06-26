import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IOrderFormView } from '../../types';

export class FormOrder extends Form<IOrderFormView> {

    private paymentButtons: HTMLButtonElement[];
    private addressElement: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);


        this.paymentButtons = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
        this.addressElement = container.querySelector('input[name="address"]') as HTMLInputElement;


        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {

                this.events.emit('order:payment-changed', { target: button.name });
            });
        });
    }


    set payment(value: 'card' | 'cash') {
        this.paymentButtons.forEach(button => {
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }


    set address(value: string) {
        if (this.addressElement) {
            this.addressElement.value = value;
        }
    }
}