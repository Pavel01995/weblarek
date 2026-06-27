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

// Models
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



//View 
export interface IHeader {
  counter: number

}


export interface IBasketView {
  list: HTMLElement[];
  total: number;
  locked: boolean;
}

export interface ICardBasketView {
  title: string;
  price: number | null;
  index: number;
}

export interface ICardCatalogView {
  title: string;
  price: number | null;
  image: string;
  category: string;
}

export interface ICardPreviewView extends ICardCatalogView {
  description: string;
  buttonText: string;
}

export interface IOrderFormView {
  payment: TPayment | null;
  address: string;
  errors: string[];
  valid: boolean;
}

export interface IContactFormView {
  email: string;
  phone: string;
  errors: string;
  valid: boolean;
}

export interface ISuccessView {
  total: number;
}

export interface ISuccessActions {
  onClick: () => void;
}

export interface IModalData {
  content: HTMLElement;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}