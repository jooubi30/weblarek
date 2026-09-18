import { Form, IFormData } from './Form';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

export interface IOrderFormData extends IFormData {
  payment: TPayment | '';
  address: string;
}

export class Order extends Form<IOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { value: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { value: 'cash' });
    });
  }

  set payment(value: TPayment | '') {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.setInputValue('address', value);
  }
}