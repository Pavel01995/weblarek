import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected submit: HTMLButtonElement;
    protected errorsElement: HTMLElement; // переименуем поле, чтобы имя не конфликтовало с сеттером errors
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);


        this.errorsElement = container.querySelector('.form__errors') as HTMLElement;
        this.submit = container.querySelector('button[type=submit]') as HTMLButtonElement;


        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit(`${this.container.getAttribute('name')}:${field}-changed`, {
                field,
                value,
            });
        });


        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    }


    set buttonAction(onClick: () => void) {
        if (this.submit && onClick) {
            this.submit.addEventListener('click', onClick);
        }
    }


    set errors(value: string) {
        if (this.errorsElement) {
            this.errorsElement.textContent = value;
        }
    }


    set valid(value: boolean) {
        if (this.submit) {
            this.submit.disabled = !value;
        }
    }


}