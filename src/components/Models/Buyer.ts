import { IBuyer, TPayment, FormErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
  protected payment: TPayment | '';
  protected email: string;
  protected phone: string;
  protected address: string;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events = events;
  }

  setData(data: Partial<IBuyer>): void {
    this.payment = data.payment ?? this.payment;
    this.email = data.email ?? this.email;
    this.phone = data.phone ?? this.phone;
    this.address = data.address ?? this.address;
    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit('buyer:changed');
  }

  validate(): FormErrors {
    const errors: FormErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.email) {
      errors.email = 'Укажите email';
    }
    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }
    if (!this.address) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}