import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IContactFormView } from '../../types';


export class FormContacts extends Form<IContactFormView> {
    private email: HTMLInputElement;
    private phone: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.email = container.querySelector('.form__input[name="email"]') as HTMLInputElement;
        this.phone = container.querySelector('.form__input[name="phone"]') as HTMLInputElement;
    }

    set phoneValue(value: string) {
        this.phone.value = value;
    }

    set emailValue(value: string) {
        this.email.value = value;
    }
}