import { Component } from "../base/Component";
import { ISuccessView, ISuccessActions } from "../../types/index"; // Не забудь импортировать ISuccessActions

export class Success extends Component<ISuccessView> {
    private totalElement: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        const closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
        this.totalElement = container.querySelector('.order-success__description') as HTMLElement;

        if (closeButton && actions?.onClick) {
            closeButton.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        if (this.totalElement) {
            this.totalElement.textContent = `Списано ${value} синапсов`;
        }
    }
}