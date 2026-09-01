import './scss/styles.scss';

import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { apiProducts } from './utils/data';

const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();

//Catalog

catalog.setItems(apiProducts.items);
console.log('Каталог: массив товаров после setItems:', catalog.getItems());

const firstId = apiProducts.items[0].id;
console.log(`Каталог: товар по id ${firstId}:`, catalog.getItem(firstId));
console.log('Каталог: товар по несуществующему id:', catalog.getItem('несуществующий-id'));

catalog.setSelectedItem(apiProducts.items[1]);
console.log('Каталог: выбранный товар после setSelectedItem:', catalog.getSelectedItem());

//Basket

console.log('Корзина: товары до добавления:', basket.getItems());

basket.addItem(apiProducts.items[0]); // 750
basket.addItem(apiProducts.items[1]); // 1450
basket.addItem(apiProducts.items[2]); // null
console.log('Корзина: товары после добавления трёх штук:', basket.getItems());

console.log('Корзина: сумма товаров (с учётом price: null):', basket.getTotal());
console.log('Корзина: количество товаров:', basket.getCount());

console.log(`Корзина: есть ли товар ${apiProducts.items[0].id}:`, basket.hasItem(apiProducts.items[0].id));
console.log('Корзина: есть ли товар с несуществующим id:', basket.hasItem('несуществующий-id'));

basket.removeItem(apiProducts.items[0].id);
console.log('Корзина: товары после удаления первого:', basket.getItems());

basket.clear();
console.log('Корзина: товары после очистки:', basket.getItems());

//Buyer

console.log('Покупатель: данные до заполнения:', buyer.getData());
console.log('Покупатель: ошибки валидации на пустых данных:', buyer.validate());

buyer.setData({ address: 'ул. Пушкина, д. 1' });
console.log('Покупатель: данные после установки только адреса:', buyer.getData());

buyer.setData({ payment: 'card', email: 'test@test.ru', phone: '+79991234567' });
console.log('Покупатель: данные после заполнения остальных полей:', buyer.getData());

console.log('Покупатель: ошибки валидации на полностью заполненных данных:', buyer.validate());

buyer.clear();
console.log('Покупатель: данные после очистки:', buyer.getData());

import { Api } from './components/base/Api';
import { ProductsApi } from './components/ProductsApi';
import { API_URL } from './utils/constants';

const api = new Api(API_URL);
const productsApi = new ProductsApi(api);

productsApi.getProducts()
  .then((response) => {
    catalog.setItems(response.items);
    console.log('Каталог: товары, полученные с сервера:', catalog.getItems());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });