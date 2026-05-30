
import { IProduct, IOrder, IOrderResult, IApi } from "../../types";

export class WebLarekAPI {
  readonly cdn: string;
  private baseApi: IApi;

  constructor(cdn: string, baseApi: IApi) {
    this.cdn = cdn;
    this.baseApi = baseApi;
  }

getProductList(): Promise<IProduct[]> {
    return this.baseApi.get<{ items: IProduct[] }>("/product")
      .then((data) => data.items);
}
  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.baseApi.post<IOrderResult>("/order", order);
  }
}
