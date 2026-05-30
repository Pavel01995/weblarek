import { IProduct } from "../../types/index";

export class BasketData {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  getAmount(): number {
    return this.items.length;
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  clearItems(): boolean {
    if (this.items.length === 0) return false;
    this.items = [];
    return true;
  }
}
