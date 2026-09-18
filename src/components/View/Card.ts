import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface ICardData {
  id: string;
  title: string;
  price: number | null;
}

export abstract class Card<T extends ICardData> extends Component<T> {
  protected events: IEvents;
  protected cardId: string = '';
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
  }

  set id(value: string) {
    this.cardId = value;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}