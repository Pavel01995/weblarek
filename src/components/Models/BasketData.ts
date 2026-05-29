import { IProduct } from "../../types/index";

export class BasketData {
  private _items: IProduct[] = [];

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(product: IProduct): void {
    this._items.push(product);
  }

  removeItem(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  getAmount(): number {
    return this._items.length;
  }

  getTotalPrice(): number {
    let sum = 0;

    for (const item of this._items) {
      sum += Number(item.price !== null ? item.price : 0);
    }

    return sum;
  }

  hasItem(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }

  clearItems(): boolean {
    if (this._items.length === 0) return false;
    this._items = [];
    return true;
  }
}
