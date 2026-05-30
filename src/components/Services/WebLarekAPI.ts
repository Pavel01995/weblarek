
import { IProduct, IOrder, IOrderResult, IApi, IProductList } from "../../types";

export class WebLarekAPI {
  private baseApi: IApi;

  constructor( baseApi: IApi) {
    this.baseApi = baseApi;
  }

getProductList(): Promise<IProductList> {
    return this.baseApi.get<IProductList>("/product");
  }
  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.baseApi.post<IOrderResult>("/order", order);
  }
}
