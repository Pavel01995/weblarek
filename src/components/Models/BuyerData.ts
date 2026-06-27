import { IBuyer, FormErrors, TPayment } from "../../types/index";
import { IEvents } from "../base/Events"; // 1. Импорт на месте

export class BuyerData {
  private payment: TPayment | null = null;
  private address: string = "";
  private phone: string = "";
  private email: string = "";

  constructor(protected events: IEvents) { }

  setBuyerData(data: Partial<IBuyer>): void {

    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.email !== undefined) this.email = data.email;


    const errors = this.validateBuyer();
    this.events.emit('buyer:errors', errors);
    this.events.emit('order:changed', this.getBuyerData());
    this.events.emit('contacts:changed', this.getBuyerData());
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }

  validateBuyer(): FormErrors {
    const errors: FormErrors = {};
    if (!this.payment) errors.payment = "Выберите способ оплаты";
    if (!this.address.trim()) errors.address = "Укажите адрес доставки";
    if (!this.phone.trim()) errors.phone = "Укажите номер телефона";
    if (!this.email.trim()) errors.email = "Укажите email";
    return errors;
  }

  clear(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events.emit('buyer:reset', {});
  }







}