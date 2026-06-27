import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";
export class ProductData {
  private productsItems: IProduct[] = [];
  private previewItem: IProduct | null = null;

  constructor(protected events: IEvents) { }

  get products(): IProduct[] {
    return this.productsItems;
  }

  set products(value: IProduct[]) {
    this.productsItems = value;
    this.events.emit('catalog:changed');
  }

  get preview(): IProduct | null {
    return this.previewItem;

  }



  set preview(product: IProduct | null) {
    this.previewItem = product;
    if (product) {
      this.events.emit('preview:changed', { product });
    }
  }
  getProduct(id: string): IProduct | undefined {
    return this.productsItems.find((product) => product.id === id);
  }
}
