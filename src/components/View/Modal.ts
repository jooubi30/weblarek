import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<{ content: HTMLElement }> {
  protected events: IEvents;
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this.contentElement = container.querySelector('.modal__content') as HTMLElement;

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.events.emit('modal:close');
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
  }
}