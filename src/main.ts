// Импорты типов
import { API_URL, CDN_URL } from "./utils/constants";
import { IProduct } from "./types";
import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
// Импорты слоя MODELS
import { BasketData } from "./components/Models/BasketData";
import { ProductData } from "./components/Models/ProductData";
import { BuyerData } from "./components/Models/BuyerData";
// Импорты слоя SERVICE
import { Api } from "./components/base/Api";
import { WebLarekAPI } from "./components/Services/WebLarekAPI";
// Импорты слоя VIEW




/// SERVICE
const api = new Api(API_URL);
const webLarekApi = new WebLarekAPI(api);

webLarekApi
  .getProductList()
  .then((data) => {
    const productsWithImages = data.items.map((item: IProduct) => ({
      ...item,
      image: CDN_URL + item.image,
    }));

    console.log(productsWithImages);
  })
  .catch((err) => {
    console.error(err);
  });


/// MODELS
const basket = new BasketData();

const productFromApi = apiProducts.items[0];
basket.addItem(productFromApi); /*добавление товара в корзину*/

const productFromApi2 = apiProducts.items[1];
basket.addItem(productFromApi2); /* добавление второго товара в корзину*/

const productFromApi3 = apiProducts.items[2];
basket.addItem(productFromApi3); /* добавление третьего товара в корзину*/

console.log(`Количество товаров в корзине`, basket.getAmount());
console.log(`Сумма товаров в корзине`, basket.getTotalPrice());

console.log(`Наличие товара в корзине`, basket.hasItem(productFromApi2.id));
console.log(`отсутствие товара в корзине`, basket.hasItem("does-not-exist-id"));

console.log(
  `Массив до удаления (длина ${basket.getAmount()}):`,
  basket.getItems(),
);

basket.removeItem(productFromApi.id);

console.log(
  `Массив после удаления (длина ${basket.getAmount()}):`,
  basket.getItems(),
);

console.log(
  `Массив до очистки корзины: ${basket.getAmount()} `,
  basket.getItems(),
);

basket.clearItems(); /* очистка корзины*/

console.log(
  `Массив после очистки корзины: ${basket.getAmount()} `,
  basket.getItems(),
);

const productsModel = new ProductData();

productsModel.products = apiProducts.items;
console.log(`добавление товаров в каталог из вне:`, productsModel.products);

productsModel.preview = apiProducts.items[0];
console.log(`установка превью товара:`, productsModel.preview);

console.log(apiProducts.items[0].id);
console.log(
  `получение товара по id:`,
  productsModel.getProduct(apiProducts.items[0].id),
);

const buyerModel = new BuyerData();

buyerModel.clear();
console.log("Ошибки в пустой модели:", buyerModel.validateBuyer());

buyerModel.setBuyerData({
  payment: null,
  address: "ул. Пушкина",
  phone: "+7 (999) 123-45-67",
  email: "buyer@example.com",
});
console.log("Ошибки при пропущенном payment:", buyerModel.validateBuyer());

buyerModel.setBuyerData({
  payment: "card",
  address: "ул. Пушкина",
  phone: "+7 (999) 123-45-67",
  email: "buyer@example.com",
});
console.log("Заполненные данные:", buyerModel.validateBuyer());


/// VIEWS

