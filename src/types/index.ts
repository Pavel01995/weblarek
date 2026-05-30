export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type FormErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "card" | "cash";

export interface IBuyer {
  payment: TPayment | null;
  address: string;
  phone: string;
  email: string;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

export interface IProductList {
  total: number;
  items: IProduct[];
}