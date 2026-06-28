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
      onClick: () => events.emit('basket:remove-item', item)
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

    const isDisabled = product.price === null;


    const previewContent = cardPreview.render({ ...product, buttonText: text });

    cardPreview.buttonDisabled = isDisabled;


    modal.render({ content: previewContent });
  }
});

events.on('card:buy', () => {
  const product = productData.preview;
  if (product && product.price !== null) {
    basketData.hasItem(product.id) ? basketData.removeItem(product.id) : basketData.addItem(product);
  } modal.close();
});


// БЛОК 3: КОРЗИНА

events.on('basket:changed', () => {
  header.counter = basketData.getAmount();
  updateBasketView();


  if (productData.preview) {
    const p = productData.preview;
    const text = p.price === null ? 'Недоступно' : (basketData.hasItem(p.id) ? 'Удалить из корзины' : 'В корзину');
    cardPreview.render({ buttonText: text });
  }
});

events.on('basket:open', () => {

  modal.render({ content: basket.render() });
});



events.on('basket:remove-item', (item: IProduct) => {
  basketData.removeItem(item.id);
});

// БЛОК 4: ОФОРМЛЕНИЕ ЗАКАЗА И ВАЛИДАЦИЯ

//  ОТКРЫТИЕ И НАВИГАЦИЯ МЕЖДУ ФОРМАМИ

events.on('order:open', () => {
  modal.render({ content: formOrder.render() });
});

events.on('order:submit', () => {
  modal.render({ content: formContacts.render() });
});


//  СЛУШАТЕЛИ ИЗМЕНЕНИЙ В ИНПУТАХ 

events.on('order:payment-changed', (data: { target: TPayment }) => {
  buyerData.setBuyerData({ payment: data.target });
});

events.on('order:address-changed', (data: { value: string }) => {
  buyerData.setBuyerData({ address: data.value });
});

events.on('contacts:email-changed', (data: { value: string }) => {
  buyerData.setBuyerData({ email: data.value });
});

events.on('contacts:phone-changed', (data: { value: string }) => {
  buyerData.setBuyerData({ phone: data.value });
});


// ЕДИНЫЙ ОБРАБОТЧИК ИЗМЕНЕНИЯ МОДЕЛИ 
events.on('buyer:changed', () => {
  const buyer: IBuyer = buyerData.getBuyerData();
  const errors: FormErrors = {};
  const isOrderPristine = !buyer.payment && (!buyer.address || buyer.address.trim() === '');
  if (!isOrderPristine) {
    if (!buyer.payment) errors.payment = 'Выберите способ оплаты';
    if (!buyer.address || buyer.address.trim() === '') errors.address = 'Необходимо указать адрес доставки';
  }
  const isContactsPristine = (!buyer.email || buyer.email.trim() === '') && (!buyer.phone || buyer.phone.trim() === '');
  if (!isContactsPristine) {
    if (!buyer.email || buyer.email.trim() === '') errors.email = 'Необходимо ввести email';
    if (!buyer.phone || buyer.phone.trim() === '') errors.phone = 'Необходимо ввести номер телефона';
  }
  const orderErrorsList = [errors.payment, errors.address].filter(Boolean) as string[];
  const contactsErrorsList = [errors.email, errors.phone].filter(Boolean) as string[];
  const isOrderValid = !!buyer.payment && !!buyer.address && orderErrorsList.length === 0;
  const isContactsValid = !!buyer.email && !!buyer.phone && contactsErrorsList.length === 0;

  // Рендерим форму заказа
  formOrder.render({
    payment: buyer.payment,
    address: buyer.address,
    valid: isOrderValid,
    errors: orderErrorsList
  });

  // Рендерим форму контактов
  formContacts.render({
    email: buyer.email,
    phone: buyer.phone,
    valid: isContactsValid,
    errors: contactsErrorsList.join('; ')
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
  buyerData.clear();
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


/* Здравствуйте Сергей  спасибо за советы  и за подсказки! Я вчера исправлял 
эти ошибки в моделях данных,  но потом по видимому когда дошел до main 
и начал там править все начало ломаться, и я позабыв что уже исправлял 
то что модель не может передавать данные опять эти данные и ввел.
Теперь вроде начинаю понимать более-именее как работает MVP. Больше на ошибках это понял. 
Модель не может передавать данные а только сообщает об изменниях  в Presenter и передает их. 
Presenter забирает эти данные когда получил сигнал, своего рода диспетчерская))) 
и передает их во View который  их отрисовывает . Model не знает об DOM дереве 
также как  и View не знает о Модэли  и  что там за данные пока ему их не передадут . */