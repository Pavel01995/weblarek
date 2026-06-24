import { IProduct } from "../../types/index";
import{IEvents}from "../base/Events"

export class BasketData {
  private items: IProduct[] = [];
constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit('basket:changed', { items: this.items });
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  this.events.emit('basket:changed', { items: this.items });
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
    this.events.emit('basket:changed', { items: this.items });
    return true;
    
  }
}
