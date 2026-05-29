import { Api } from "../base/Api";
import { IProduct, IOrder, IOrderResult } from "../../types";

export class WebLarekAPI {
  readonly cdn: string;
  private baseApi: Api;

  constructor(cdn: string, baseApi: Api) {
    this.cdn = cdn;
    this.baseApi = baseApi;
  }

  getProductList(): Promise<IProduct[]> {
    return this.baseApi.get<{ items: IProduct[] }>("/product").then((data) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      })),
    );
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.baseApi.post<IOrderResult>("/order", order);
  }
}
