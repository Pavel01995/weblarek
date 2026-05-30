import { IProduct } from "../../types/index";

export class ProductData {
  private productsItems: IProduct[] = [];
  private previewItem: IProduct | null = null;

  get products(): IProduct[] {
    return this.productsItems;
  }

  set products(value: IProduct[]) {
    this.productsItems = value;
  }

  get preview(): IProduct | null {
    return this.previewItem;
  }

  set preview(product: IProduct) {
    this.previewItem = product;
  }

  getProduct(id: string): IProduct | undefined {
    return this.productsItems.find((product) => product.id === id);
  }
}
