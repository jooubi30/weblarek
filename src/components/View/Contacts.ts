import { Form, IFormData } from './Form';

export interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContactsFormData> {
  set email(value: string) {
    this.setInputValue('email', value);
  }

  set phone(value: string) {
    this.setInputValue('phone', value);
  }
}