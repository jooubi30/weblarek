import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected events: IEvents;
  protected listElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.listElement = container.querySelector('.basket__list') as HTMLElement;
    this.priceElement = container.querySelector('.basket__price') as HTMLElement;
    this.button = container.querySelector('.basket__button') as HTMLButtonElement;

    this.button.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(value: HTMLElement[]) {
    if (value.length === 0) {
      this.listElement.replaceChildren();
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Корзина пуста';
      this.listElement.replaceChildren(emptyMessage);
      this.button.disabled = true;
    } else {
      this.listElement.replaceChildren(...value);
      this.button.disabled = false;
    }
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }
}