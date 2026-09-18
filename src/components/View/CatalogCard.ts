import { Card, ICardData } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface ICatalogCardData extends ICardData {
  image: string;
  category: string;
}

export class CatalogCard extends Card<ICatalogCardData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);
    this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
    this.categoryElement = container.querySelector('.card__category') as HTMLElement;
    container.addEventListener('click', onClick);
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
}