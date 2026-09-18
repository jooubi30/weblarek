import { Card, ICardData } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface IPreviewCardData extends ICardData {
  image: string;
  category: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class PreviewCard extends Card<IPreviewCardData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
    this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;
    this.buttonElement.addEventListener('click', onClick);
  }

  set image(value: string) {
    this.setImage(this.imageElement, `${CDN_URL}${value}`);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = 'card__category';
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) this.categoryElement.classList.add(modifier);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}