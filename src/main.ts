// ПРЕЗЕНТЕР ПРИЛОЖЕНИЯ
import './scss/styles.scss';
import { API_URL, CDN_URL } from "./utils/constants";
import { IProduct, TPayment, FormErrors, IBuyer } from "./types";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";

// МОДЕЛИ ДАННЫХ
import { ProductData } from "./components/Models/ProductData";
import { BasketData } from "./components/Models/BasketData";
import { BuyerData } from "./components/Models/BuyerData";

// СЕРВИСЫ
import { Api } from "./components/base/Api";
import { WebLarekAPI } from "./components/Services/WebLarekAPI";

// ПРЕДСТАВЛЕНИЯ
import { CardCatalog } from "./components/View/CardCatalog";
import { CardPreview } from "./components/View/CardPreview";
import { CardBasket } from "./components/View/CardBasket";
import { Modal } from "./components/View/Modal";
import { Header } from "./components/View/Header";
import { Basket } from "./components/View/Basket";
import { FormOrder } from "./components/View/FormOrder";
import { FormContacts } from "./components/View/FormContacts";
import { Success } from "./components/View/Success";


//  ИНИЦИАЛИЗАЦИЯ 

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekAPI(api);

const productData = new ProductData(events);
const basketData = new BasketData(events);
const buyerData = new BuyerData(events);

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const basket = new Basket(cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')), events);
const formOrder = new FormOrder(cloneTemplate(ensureElement<HTMLTemplateElement>('#order')), events);
const formContacts = new FormContacts(cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')), events);

const cardPreview = new CardPreview(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview')), {
  onClick: () => events.emit('card:buy')
});

const success = new Success(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), {
  onClick: () => modal.close()
});

/**  Обновление содержимого корзины (список и итоговая цена) **/
const updateBasketView = () => {
  const items = basketData.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')), {
      onClick: () => basketData.removeItem(item.id)
    });
    return card.render({ index: index + 1, title: item.title, price: item.price });
  });

  // Обновляем визуальный список и блокируем кнопку "Оформить", если пусто
  basket.render({
    list: items,
    total: basketData.getTotalPrice(),
    locked: items.length === 0
  });
};


// БЛОК 1: КАТАЛОГ ТОВАРОВ


events.on('catalog:changed', () => {
  const gallery = ensureElement<HTMLElement>('.gallery');
  gallery.replaceChildren(...productData.products.map(item => {
    const card = new CardCatalog(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')), {
      onClick: () => events.emit('card:select', item)
    });
    return card.render(item);
  }));
});

events.on('card:select', (item: IProduct) => {
  productData.preview = item;
});


// БЛОК 2: ПРЕДПРОСМОТР ТОВАРА


events.on('preview:changed', () => {
  const product = productData.preview;
  if (product) {
    const text = product.price === null
      ? 'Недоступно'
      : (basketData.hasItem(product.id) ? 'Удалить из корзины' : 'В корзину');
    modal.render({ content: cardPreview.render({ ...product, buttonText: text }) });
  }
});

events.on('card:buy', () => {
  const product = productData.preview;
  if (product && product.price !== null) {
    basketData.hasItem(product.id) ? basketData.removeItem(product.id) : basketData.addItem(product);
  }
});


// БЛОК 3: КОРЗИНА


events.on('basket:changed', () => {
  header.counter = basketData.getAmount();
  updateBasketView();

  // Синхронизируем текст кнопки в превью
  if (productData.preview) {
    const p = productData.preview;
    const text = p.price === null ? 'Недоступно' : (basketData.hasItem(p.id) ? 'Удалить из корзины' : 'В корзину');
    cardPreview.render({ buttonText: text });
  }
});

events.on('basket:open', () => {
  updateBasketView();
  modal.render({ content: basket.render() });
});


// БЛОК 4: ОФОРМЛЕНИЕ ЗАКАЗА И ВАЛИДАЦИЯ


events.on('order:open', () => {
  modal.render({ content: formOrder.render({ payment: null, address: '', valid: false, errors: [] }) });
});

events.on('order:payment-changed', (data: { target: TPayment }) => buyerData.setBuyerData({ payment: data.target }));
events.on('order:address-changed', (data: { value: string }) => buyerData.setBuyerData({ address: data.value }));
events.on('order:changed', (data: IBuyer) => formOrder.render({ payment: data.payment, address: data.address }));

events.on('order:submit', () => {
  modal.render({ content: formContacts.render({ email: '', phone: '', valid: false, errors: '' }) });
});

events.on('contacts:email-changed', (data: { value: string }) => buyerData.setBuyerData({ email: data.value }));
events.on('contacts:phone-changed', (data: { value: string }) => buyerData.setBuyerData({ phone: data.value }));
events.on('contacts:changed', (data: IBuyer) => formContacts.render({ email: data.email, phone: data.phone }));

events.on('buyer:errors', (errors: FormErrors) => {
  const { payment, address, email, phone } = errors;
  formOrder.render({
    valid: !payment && !address,
    errors: [payment, address].filter(Boolean) as string[]
  });
  formContacts.render({
    valid: !email && !phone,
    errors: [email, phone].filter(Boolean).join('; ')
  });
});





// БЛОК 5: ОТПРАВКА И ЗАВЕРШЕНИЕ
events.on('contacts:submit', () => {
  webLarekApi.postOrder({
    ...buyerData.getBuyerData(),
    total: basketData.getTotalPrice(),
    items: basketData.getItems().map(i => i.id)
  })
    .then((result) => {

      basketData.clearItems();
      buyerData.clear();

      modal.render({ content: success.render({ total: result.total }) });
    })
    .catch(console.error);
});

events.on('buyer:reset', () => {
  formOrder.render({ payment: null, address: '', valid: false, errors: [] });
  formContacts.render({ email: '', phone: '', valid: false, errors: '' });
});


//  ЗАГРУЗКА ПЕРВИЧНЫХ ДАННЫХ 


webLarekApi.getProductList().then(data => {
  productData.products = data.items.map(item => ({
    ...item,
    image: CDN_URL + item.image
  }));
});