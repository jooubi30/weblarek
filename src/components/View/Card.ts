import { Component } from '../base/Component';

export interface ICardData {
  title: string;
  price: number | null;
}

export abstract class Card<T extends ICardData> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }
}