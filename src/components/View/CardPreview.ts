import { CardWithCategory } from "./CardWithCategory";
import { IEvents } from "../base/Events";
import { ICardPreviewView } from "../../types";

export class CardPreview extends CardWithCategory<ICardPreviewView> {
  private descriptionElement: HTMLElement;
  private buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
    this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;


    if (this.buttonElement) {
      this.buttonElement.addEventListener('click', () => {

        this.events.emit('card:buy', { card: this });
      });
    }
  }

  set description(value: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = value;
    }
  }


  set buttonText(value: string) {
    if (this.buttonElement) {
      this.buttonElement.textContent = value;
    }
  }
}