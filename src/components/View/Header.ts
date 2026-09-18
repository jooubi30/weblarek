import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Header extends Component<{ counter: number }> {
  protected events: IEvents;
  protected basketButton: HTMLButtonElement;
  protected basketCounter: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this.basketCounter = container.querySelector('.header__basket-counter') as HTMLElement;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}