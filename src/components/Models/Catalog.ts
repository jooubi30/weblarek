import { IProduct } from "../../types";

export class Catalog {
  protected items: IProduct[];
  protected selectedItem: IProduct | null;

  constructor() {
    this.items = [];
    this.selectedItem = null;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}