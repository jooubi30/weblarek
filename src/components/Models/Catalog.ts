import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
  protected items: IProduct[];
  protected selectedItem: IProduct | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.selectedItem = null;
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit('catalog:selectedItemChanged');
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}