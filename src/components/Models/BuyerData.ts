import { IBuyer, FormErrors, TPayment } from "../../types/index";

export class BuyerData {
  private _payment: TPayment = "card";
  private _address: string = "";
  private _phone: string = "";
  private _email: string = "";

  get payment(): TPayment {
    return this._payment;
  }

  set payment(value: TPayment) {
    this._payment = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  setBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this._payment = data.payment;
    }
    if (data.address !== undefined) {
      this._address = data.address;
    }
    if (data.phone !== undefined) {
      this._phone = data.phone;
    }
    if (data.email !== undefined) {
      this._email = data.email;
    }
  }

  getBuyerData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  // 4. Валидация полей
  validateBuyer(): FormErrors {
    const errors: FormErrors = {};

    if (!this._payment) {
      errors.payment = "Выберите способ оплаты";
    }
    if (!this._address) {
      errors.address = "Укажите адрес доставки";
    }
    if (!this._phone) {
      errors.phone = "Укажите номер телефона";
    }
    if (!this._email) {
      errors.email = "Укажите email";
    }

    return errors;
  }

  clear(): void {
    this._payment = "card"; // Сбросили обратно на карту
    this._address = "";
    this._phone = "";
    this._email = "";
  }
}
