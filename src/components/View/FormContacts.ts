import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IContactFormView } from '../../types';

export class FormContacts extends Form<IContactFormView> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.emailInput = container.querySelector('.form__input[name="email"]') as HTMLInputElement;
        this.phoneInput = container.querySelector('.form__input[name="phone"]') as HTMLInputElement;


        this.phoneInput.addEventListener('input', () => {
            this.phoneInput.value = this.phoneInput.value.replace(/[^\d+]/g, '');
        });
    }


    set phone(value: string) {
        this.phoneInput.value = value;
    }


    set email(value: string) {
        this.emailInput.value = value;
    }
}