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

import { API_URL } from './utils/constants';
import { IProduct, IOrder, TPayment } from './types';

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const api = new Api(API_URL);
const productsApi = new ProductsApi(api);

const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const gallery = new Gallery(galleryContainer);

const headerContainer = document.querySelector('.header') as HTMLElement;
const header = new Header(headerContainer, events);

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalContainer, events);

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

let currentPreviewCard: PreviewCard | null = null;
let currentOrderForm: Order | null = null;
let currentContactsForm: Contacts | null = null;
let isBasketOpen = false;

function getPreviewButtonState(item: IProduct): { buttonText: string; buttonDisabled: boolean } {
  if (item.price === null) {
    return { buttonText: 'Недоступно', buttonDisabled: true };
  }
  return {
    buttonText: basket.hasItem(item.id) ? 'Удалить из корзины' : 'Купить',
    buttonDisabled: false,
  };
}

function getOrderFormState() {
  const data = buyer.getData();
  const errors = buyer.validate();
  const orderErrors = [errors.payment, errors.address].filter(Boolean);
  return {
    payment: data.payment,
    valid: orderErrors.length === 0,
    errors: orderErrors.join('. '),
  };
}

function getContactsFormState() {
  const errors = buyer.validate();
  const contactsErrors = [errors.email, errors.phone].filter(Boolean);
  return {
    valid: contactsErrors.length === 0,
    errors: contactsErrors.join('. '),
  };
}

function renderCatalog(): void {
  const cardElements = catalog.getItems().map((item) => {
    const cardContainer = cardCatalogTemplate.content.cloneNode(true) as HTMLElement;
    const cardButton = cardContainer.querySelector('.card') as HTMLElement;
    const card = new CatalogCard(cardButton, events);
    return card.render(item);
  });
  gallery.render({ items: cardElements });
}

function renderBasketView(): HTMLElement {
  const basketContainer = basketTemplate.content.cloneNode(true) as HTMLElement;
  const basketRoot = basketContainer.querySelector('.basket') as HTMLElement;
  const basketView = new BasketView(basketRoot, events);

  const itemElements = basket.getItems().map((item, index) => {
    const cardContainer = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
    const cardRoot = cardContainer.querySelector('.basket__item') as HTMLElement;
    const card = new BasketCard(cardRoot, events);
    return card.render({ ...item, index: index + 1 });
  });

  return basketView.render({ items: itemElements, total: basket.getTotal() });
}

events.on('catalog:changed', () => {
  renderCatalog();
});

events.on('catalog:selectedItemChanged', () => {
  const item = catalog.getSelectedItem();
  if (!item) return;

  const previewContainer = cardPreviewTemplate.content.cloneNode(true) as HTMLElement;
  const previewRoot = previewContainer.querySelector('.card') as HTMLElement;
  currentPreviewCard = new PreviewCard(previewRoot, events);

  modal.render({
    content: currentPreviewCard.render({ ...item, ...getPreviewButtonState(item) }),
  });
  modal.open();
});

events.on('basket:changed', () => {
  header.render({ counter: basket.getCount() });

  const selected = catalog.getSelectedItem();
  if (currentPreviewCard && selected) {
    currentPreviewCard.render(getPreviewButtonState(selected));
  }

  if (isBasketOpen) {
    modal.render({ content: renderBasketView() });
  }
});

events.on('buyer:changed', () => {
  if (currentOrderForm) {
    currentOrderForm.render(getOrderFormState());
  }
  if (currentContactsForm) {
    currentContactsForm.render(getContactsFormState());
  }
});

events.on<{ id: string }>('card:select', ({ id }) => {
  const item = catalog.getItem(id);
  if (item) {
    catalog.setSelectedItem(item);
  }
});

events.on<{ id: string }>('card:toggleBasket', ({ id }) => {
  const item = catalog.getItem(id);
  if (!item) return;

  if (basket.hasItem(id)) {
    basket.removeItem(id);
  } else {
    basket.addItem(item);
  }
});

events.on<{ id: string }>('basket:remove', ({ id }) => {
  basket.removeItem(id);
});

events.on('basket:open', () => {
  isBasketOpen = true;
  modal.render({ content: renderBasketView() });
  modal.open();
});

events.on('order:open', () => {
  const orderContainer = orderTemplate.content.cloneNode(true) as HTMLElement;
  const orderRoot = orderContainer.querySelector('form') as HTMLFormElement;
  currentOrderForm = new Order(orderRoot, events);

  modal.render({ content: currentOrderForm.render(getOrderFormState()) });
  modal.open();
});

events.on<{ value: string }>('order.payment:change', ({ value }) => {
  buyer.setData({ payment: value as TPayment });
});

events.on<{ value: string }>('order.address:change', ({ value }) => {
  buyer.setData({ address: value });
});

events.on('order:submit', () => {
  currentOrderForm = null;

  const contactsContainer = contactsTemplate.content.cloneNode(true) as HTMLElement;
  const contactsRoot = contactsContainer.querySelector('form') as HTMLFormElement;
  currentContactsForm = new Contacts(contactsRoot, events);

  modal.render({ content: currentContactsForm.render(getContactsFormState()) });
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
      currentContactsForm = null;

      const successContainer = successTemplate.content.cloneNode(true) as HTMLElement;
      const successRoot = successContainer.querySelector('.order-success') as HTMLElement;
      const success = new Success(successRoot, events);

      modal.render({ content: success.render({ total: result.total }) });
      modal.open();

      basket.clear();
      buyer.clear();
    })
    .catch((error) => {
      console.error('Ошибка при оформлении заказа:', error);
    });
});

events.on('modal:close', () => {
  modal.close();
  currentPreviewCard = null;
  currentOrderForm = null;
  currentContactsForm = null;
  isBasketOpen = false;
});

productsApi.getProducts()
  .then((response) => {
    catalog.setItems(response.items);
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });