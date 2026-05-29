import { IProduct } from "../../types/index";

export class ProductData {
  private _products: IProduct[] = [];
  private _preview: IProduct | null = null;

  get products(): IProduct[] {
    return this._products;
  }

  set products(value: IProduct[]) {
    this._products = value;
  }

  get preview(): IProduct | null {
    return this._preview;
  }

  set preview(product: IProduct) {
    this._preview = product;
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find((product) => product.id === id);
  }
}
