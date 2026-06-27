import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IModalData } from '../../types/index';



export class Modal extends Component<IModalData> {

  private closeButton: HTMLButtonElement;
  private contentElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {

    super(container);


    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this.contentElement = container.querySelector('.modal__content') as HTMLElement;


    this.closeButton.addEventListener('click', () => this.close());


    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });


    this.contentElement.addEventListener('click', (event) => event.stopPropagation());
  }


  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }


  open() {
    this.container.classList.add('modal_active');

  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  render(data: IModalData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}