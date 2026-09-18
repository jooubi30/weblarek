import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Success extends Component<{ total: number }> {
  protected events: IEvents;
  protected closeButton: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;
    this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}