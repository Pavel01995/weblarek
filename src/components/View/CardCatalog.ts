import { CardWithCategory } from "./CardWithCategory";
import { IEvents } from "../base/Events";
import { ICardCatalogView } from "../../types";

export class CardCatalog extends CardWithCategory<ICardCatalogView> {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);


    this.container.addEventListener('click', () => {

      this.events.emit('card:select', { card: this });
    });
  }
}