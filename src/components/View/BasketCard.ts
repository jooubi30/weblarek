import { Card, ICardData } from './Card';

export interface IBasketCardData extends ICardData {
  index: number;
}

export class BasketCard extends Card<IBasketCardData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;
    this.deleteButton.addEventListener('click', onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}