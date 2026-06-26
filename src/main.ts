// ПРЕЗЕНТЕР ПРИЛОЖЕНИЯ 
import './scss/styles.scss';
import { API_URL, CDN_URL } from "./utils/constants";
import { IProduct, TPayment, FormErrors, IOrder } from "./types";
import { EventEmitter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";

//  МОДЕЛИ ДАННЫХ 
import { ProductData } from "./components/Models/ProductData";
import { BasketData } from "./components/Models/BasketData";
import { BuyerData } from "./components/Models/BuyerData";

//  СЕРВИСЫ 
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


 // ИНИЦИАЛИЗАЦИЯ
 
 

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekAPI(api);

// Экземпляры моделей
const productData = new ProductData(events);
const basketData = new BasketData(events);
const buyerData = new BuyerData(events);

// Глобальные компоненты интерфейса
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const header = new Header(ensureElement<HTMLElement>('.header'), events);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Контейнеры
const galleryContainer = ensureElement<HTMLElement>('.gallery');
let activeForm: FormOrder | FormContacts | null = null;


 


// БЛОК 1: КАТАЛОГ ТОВАРОВ 
 

// Обработка события изменения каталога в модели
events.on('catalog:changed', () => {
  galleryContainer.replaceChildren(...productData.products.map(item => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    const el = card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price
    });
    // Выбор карточки для просмотра
    el.addEventListener('click', () => events.emit('card:select', item));
    return el;
  }));
});

// Реагирование на выбор карточки в представлении
events.on('card:select', (item: IProduct) => {
  productData.preview = item;
});


// БЛОК 2: ПРЕДПРОСМОТР ТОВАРА 
 

// Обработка события изменения выбранного товара в модели
events.on('preview:changed', (data: { product: IProduct }) => {
  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
  const inBasket = basketData.hasItem(data.product.id);

  modal.render({
    content: cardPreview.render({
      title: data.product.title,
      image: data.product.image,
      category: data.product.category,
      description: data.product.description,
      price: data.product.price,
      buttonText: data.product.price === null
        ? 'Недоступно'
        : (inBasket ? 'Удалить из корзины' : 'В корзину')
    })
  });
});

// Обработка покупки (добавление/удаление) из превью
events.on('card:buy', () => {
  const product = productData.preview;
  if (product && product.price !== null) {
    if (!basketData.hasItem(product.id)) {
      basketData.addItem(product);
    } else {
      basketData.removeItem(product.id);
    }
    // Перерисовываем превью, чтобы обновить текст кнопки
    events.emit('preview:changed', { product });
  }
});

// БЛОК 3: КОРЗИНА 


// Синхронизация счетчика в хедере при изменении модели корзины
events.on('basket:changed', () => {
  header.counter = basketData.getAmount();
});

// Открытие модального окна корзины
events.on('basket:open', () => {
  const basket = new Basket(cloneTemplate(basketTemplate), events);
  const items = basketData.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
    const el = card.render({ index: index + 1, title: item.title, price: item.price });
    // Слушатель удаления товара из корзины
    el.querySelector('.card__button')?.addEventListener('click', () => {
      basketData.removeItem(item.id);
      events.emit('basket:open'); // Перерисовываем открытую корзину
    });
    return el;
  });

  modal.render({
    content: basket.render({
      list: items,
      total: basketData.getTotalPrice(),
      locked: basketData.getAmount() === 0
    })
  });
});


 // БЛОК 4: ОФОРМЛЕНИЕ ЗАКАЗА И ВАЛИДАЦИЯ 
 

// Открытие первой формы заказа (Способ оплаты и Адрес)
events.on('order:open', () => {
  activeForm = new FormOrder(cloneTemplate(orderTemplate), events);
  const info = buyerData.getBuyerData();
  modal.render({
    content: activeForm.render({
      payment: info.payment,
      address: info.address,
      valid: false,
      errors: []
    })
  });
});

// Обработка изменения данных в формах через модель данных покупателя
events.on('order:payment-changed', (data: { target: TPayment }) => {
  buyerData.setBuyerData({ payment: data.target });
  if (activeForm instanceof FormOrder) activeForm.render({ payment: data.target });
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

// Переход ко второй форме (Контакты)
events.on('order:submit', () => {
  activeForm = new FormContacts(cloneTemplate(contactsTemplate), events);
  const info = buyerData.getBuyerData();
  modal.render({
    content: activeForm.render({
      email: info.email,
      phone: info.phone,
      valid: false,
      errors: ''
    })
  });
});

// Универсальный обработчик ошибок валидации от модели покупателя
events.on('buyer:errors', (errors: FormErrors) => {
  if (!activeForm) return;
  const { payment, address, email, phone } = errors;

  if (activeForm instanceof FormOrder) {
    activeForm.valid = !payment && !address;
    activeForm.errors = Object.values({ payment, address }).filter(Boolean).join('; ');
  } else {
    activeForm.valid = !email && !phone;
    activeForm.errors = Object.values({ email, phone }).filter(Boolean).join('; ');
  }
});

// БЛОК 5: ФИНАЛЬНАЯ ОТПРАВКА И ЗАВЕРШЕНИЕ 


events.on('contacts:submit', () => {
  const info = buyerData.getBuyerData();
  const totalPrice = basketData.getTotalPrice();

  const orderData: IOrder = {
    ...info,
    total: totalPrice,
    items: basketData.getItems().map(item => item.id)
  };

  // Отправка данных на сервер
  webLarekApi.postOrder(orderData)
    .then((result) => {
      // Создание представления успеха
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => modal.close()
      });

      // Отображение окна успеха
      modal.render({
        content: success.render({
          total: result.total || totalPrice
        })
      });

      // Очистка данных моделей после успешной транзакции
      basketData.clearItems();
      buyerData.clear();
      events.emit('basket:changed');
      activeForm = null;
    })
    .catch(err => console.error('Критическая ошибка оформления заказа:', err));
});


// Первичный запрос данных при загрузке страницы
webLarekApi.getProductList()
  .then((data) => {
    // Преобразуем данные и сохраняем в модель, что вызовет 'catalog:changed'
    productData.products = data.items.map(item => ({
      ...item,
      image: CDN_URL + item.image
    }));
  })
  .catch(err => console.error('Ошибка инициализации каталога:', err));