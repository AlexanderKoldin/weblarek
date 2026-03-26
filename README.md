# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

## Структура проекта:

- `src/` — исходные файлы проекта
- `src/components/` — папка с компонентами логики и отображения
- `src/components/base/` — папка с базовым кодом (API, брокер событий, базовый компонент)
- `src/components/Models/` — папка с моделями данных

## Важные файлы:

- `index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами данных
- `src/main.ts` — точка входа приложения (Presenter)
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами (API_URL, CDN_URL)
- `src/utils/utils.ts` — вспомогательные функции для работы с DOM

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды:

```bash
npm install
npm run dev
```

Сборка

npm run build

---

## Интернет-магазин «Web-Larёk»

**Web-Larёk** — это интернет-магазин с товарами для веб-разработчиков.  
Пользователи могут:

- просматривать каталог
- добавлять товары в корзину
- оформлять заказы с выбором способа оплаты

---

## Архитектура приложения

Приложение реализовано в рамках паттерна **MVP (Model-View-Presenter)**:

- **Model** — отвечает за хранение и обработку данных  
  (`CatalogModel`, `BasketModel`, `OrderModel`)

- **View** — отвечает за визуальное отображение  
  (базовый класс `Component`)

- **Presenter** — связующее звено, реализованное в `src/main.ts`  
  Инициализирует модели, настраивает слушателей событий в `EventEmitter`  
  и координирует работу API и интерфейса

Взаимодействие слоев организовано через событийно-ориентированный подход  
с использованием брокера событий **EventEmitter**.

---

## Базовый код

### Класс Component

Абстрактный базовый класс для всех компонентов интерфейса.  
Является дженериком и принимает тип данных `T`.

**Конструктор:**

```ts
 protected constructor(container: HTMLElement) — принимает корневой DOM-элемент.
```

**Методы:**

- `render(data?: Partial<T>): HTMLElement` — обновляет свойства компонента и возвращает его элемент
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение и альтернативный текст

---

### 🌐 Класс Api

Содержит базовую логику отправки запросов на сервер.

**Конструктор:**

```ts
constructor(baseUrl: string, options: RequestInit = {})
```

**Методы:**

- `get<T>(uri: string): Promise<T>` — GET запрос
- `post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T>` — POST запрос
- `handleResponse<T>(response: Response): Promise<T>` — обработка ответа сервера

---

### Класс EventEmitter

Брокер событий (паттерн **«Наблюдатель»**).  
Обеспечивает связь между Моделями и Презентером.

**Методы:**

- `on` — подписка
- `emit` — уведомление
- `trigger` — создание триггера
- `off` — отписка
- `onAll` — слушать всё
- `offAll` — сброс

---

## Слой данных (Model)

### Типы данных (Interfaces)

- **IProduct** — характеристики товара  
  (`id, description, image, title, category, price`)

- **IBuyer** — данные покупателя  
  (`payment, email, phone, address`)

- **IOrder** — объект заказа  
  (`total, items: string[] + поля IBuyer`)

- **IOrderResult** — ответ сервера  
  (`id, total`)

- **FormErrors** — словарь ошибок валидации  
  (`Partial<Record<keyof IBuyer, string>>`)

## Модели данных

### Класс CatalogModel

Хранит каталог товаров и управляет предпросмотром.

**Конструктор:**

```ts
constructor(protected events: IEvents) — принимает брокер событий.
```

**Поля:**

- `_items: IProduct[]`
- `_preview: IProduct | null`

**Методы:**

- `setItems(items: IProduct[]): void` — запись товаров и уведомление системы
- `getProduct(id: string): IProduct | undefined` — поиск товара по ID

**Preview:**

- `set preview(item: IProduct | null): void` — установка товара для предпросмотра
- `get preview(): IProduct | null` — получение текущего товара предпросмотра

---

### Класс BasketModel

Управляет состоянием корзины.

**Конструктор:**

```ts
constructor(protected events: IEvents)
```

**Методы:**

- `add(item: IProduct): void` — добавление товара в корзину
- `remove(id: string): void` — удаление товара из корзины по ID
- `clear(): void` — очистка корзины
- `getItems(): IProduct[]` — получение массива товаров в корзине
- `getTotal(): number` — расчет итоговой суммы
- `getCount(): number` — количество товаров в корзине
- `hasItem(id: string): boolean` — проверка наличия товара в корзине

### 🧾 Класс OrderModel

Хранит данные заказа и отвечает за их валидацию.

**Конструктор:**

```ts
constructor(protected events: IEvents)
```

**Поля:**

- `_order: IBuyer`
- `formErrors: FormErrors`

**Методы:**

- `setField(field: keyof IBuyer, value: string): void` — запись данных и запуск валидации
- `validateOrder(): boolean` — проверка полей, заполнение formErrors и генерация события ошибок
- `getOrderData(): IBuyer` — получение текущих данных заказа
- `clearOrder(): void` — очистка данных заказа

---

## 🌍 Слой коммуникации (API)

### 🔌 Класс LarekApi

Расширяет `Api`, предоставляя методы для работы с эндпоинтами магазина.

**Конструктор:**

```ts
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```

**Методы:**

- `getLotList(): Promise<IProduct[]>` — загрузка каталога
- `getLotItem(id: string): Promise<IProduct>` — получение данных одного товара
- `orderLots(order: IOrder): Promise<IOrderResult>` — оформление заказа
