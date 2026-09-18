import './scss/styles.scss';

import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { ProductsApi } from './components/ProductsApi';

import { Gallery } from './components/View/Gallery';
import { CatalogCard } from './components/View/CatalogCard';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { Basket as BasketView } from './components/View/Basket';
import { Success } from './components/View/Success';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';

import { cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';
import { IProduct, IOrder, TPayment } from './types';

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const productsApi = new ProductsApi(api);

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(galleryContainer);

const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(headerContainer, events);

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalContainer);

const previewCard = new PreviewCard(cloneTemplate<HTMLElement>(cardPreviewTemplate), () => {
  events.emit('card:toggleBasket');
});

const basketView = new BasketView(cloneTemplate<HTMLElement>(basketTemplate), events);
const orderForm = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contactsForm = new Contacts(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const success = new Success(cloneTemplate<HTMLElement>(successTemplate), events);

function getPreviewButtonState(item: IProduct): { buttonText: string; buttonDisabled: boolean } {
  if (item.price === null) {
    return { buttonText: 'Недоступно', buttonDisabled: true };
  }
  return {
    buttonText: basket.hasItem(item.id) ? 'Удалить из корзины' : 'Купить',
    buttonDisabled: false,
  };
}

function renderCatalog(): void {
  const cardElements = catalog.getItems().map((item) => {
    const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
    const card = new CatalogCard(cardElement, () => events.emit('card:select', { id: item.id }));
    return card.render({
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  });
  gallery.render({ items: cardElements });
}

function renderBasketItems(): void {
  const itemElements = basket.getItems().map((item, index) => {
    const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
    const card = new BasketCard(cardElement, () => events.emit('basket:remove', { id: item.id }));
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  basketView.render({ items: itemElements, total: basket.getTotal() });
}

function renderBuyerForms(): void {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: !errors.payment && !errors.address,
    errors: [errors.payment, errors.address].filter(Boolean).join('. '),
  });

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: [errors.email, errors.phone].filter(Boolean).join('. '),
  });
}

events.on('catalog:changed', renderCatalog);

events.on('catalog:selectedItemChanged', () => {
  const item = catalog.getSelectedItem();
  if (!item) return;

  modal.render({
    content: previewCard.render({
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description,
      ...getPreviewButtonState(item),
    }),
  });
  modal.open();
});

events.on('basket:changed', () => {
  header.render({ counter: basket.getCount() });
  renderBasketItems();

  const selected = catalog.getSelectedItem();
  if (selected) {
    previewCard.render(getPreviewButtonState(selected));
  }
});

events.on('buyer:changed', renderBuyerForms);

events.on<{ id: string }>('card:select', ({ id }) => {
  const item = catalog.getItem(id);
  if (item) {
    catalog.setSelectedItem(item);
  }
});

events.on('card:toggleBasket', () => {
  const item = catalog.getSelectedItem();
  if (!item) return;

  if (basket.hasItem(item.id)) {
    basket.removeItem(item.id);
  } else {
    basket.addItem(item);
  }
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
  basket.removeItem(id);
});

events.on('basket:open', () => {
  modal.render({ content: basketView.render() });
  modal.open();
});

events.on('order:open', () => {
  modal.render({ content: orderForm.render() });
  modal.open();
});

events.on<{ value: string }>('order.payment:change', ({ value }) => {
  buyer.setData({ payment: value as TPayment });
});

events.on<{ value: string }>('order.address:change', ({ value }) => {
  buyer.setData({ address: value });
});

events.on('order:submit', () => {
  modal.render({ content: contactsForm.render() });
  modal.open();
});

events.on<{ value: string }>('contacts.email:change', ({ value }) => {
  buyer.setData({ email: value });
});

events.on<{ value: string }>('contacts.phone:change', ({ value }) => {
  buyer.setData({ phone: value });
});

events.on('contacts:submit', () => {
  const order: IOrder = {
    ...buyer.getData(),
    total: basket.getTotal(),
    items: basket.getItems().map((item) => item.id),
  };

  productsApi.postOrder(order)
    .then((result) => {
      modal.render({ content: success.render({ total: result.total }) });
      modal.open();

      basket.clear();
      buyer.clear();
    })
    .catch((error) => {
      console.error('Ошибка при оформлении заказа:', error);
    });
});

events.on('success:close', () => {
  modal.close();
});

renderBasketItems();
renderBuyerForms();

productsApi.getProducts()
  .then((response) => {
    catalog.setItems(response.items);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });