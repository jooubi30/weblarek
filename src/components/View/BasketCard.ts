import { Card, ICardData } from './Card';
import { IEvents } from '../base/Events';

export interface IBasketCardData extends ICardData {
  index: number;
}

export class BasketCard extends Card<IBasketCardData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this.cardId });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}