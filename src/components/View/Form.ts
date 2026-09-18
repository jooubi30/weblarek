import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormData {
  valid: boolean;
  errors: string;
}

export abstract class Form<T extends IFormData> extends Component<T> {
  protected events: IEvents;
  protected formName: string;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this.formName = container.getAttribute('name') ?? '';
    this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsElement = container.querySelector('.form__errors') as HTMLElement;

    container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit(`${this.formName}.${target.name}:change`, { value: target.value });
    });

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit(`${this.formName}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}