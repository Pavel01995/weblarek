import { CardWithCategory } from "./CardWithCategory";
import { ICardCatalogView, ICardActions } from "../../types"; 
export class CardCatalog extends CardWithCategory<ICardCatalogView> {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    if (actions?.onClick) {
      this.container.addEventListener('click', (e) => {
        actions.onClick(e as MouseEvent);
      }, true); 
    }
  }
}