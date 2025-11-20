<a name="readme-top"></a>

<br />
<div align="center">
  <a href="https://github.com/lavrentious/tgrfront">
    <img src="https://tifloguide.ru/logo.png" alt="Logo" width="200" height="200" style="filter: drop-shadow(3px 3px 3px #aaa)">
  </a>

  <h3 align="center">tgrfront — Frontend for <a href="https://tifloguide.ru">TifloGuide</a></h3>

  <p align="center">
    Клиентская часть веб-приложения <strong>TifloGuide</strong> 
    <br />
    <a href="https://tgrapi.tifloguide.ru/docs"><strong>API документация »</strong></a>
    <br/ >
    <a href="https://tifloguide.ru"><strong>Деплой »</strong></a>
  </p>
</div>

---

## О проекте

**TifloGuide** — это некоммерческий проект, цель которого — сделать городскую среду доступнее для людей с нарушением зрения.

Проект создан в сотрудничестве с **Бийским филиалом ЦРС ВОС**.

Этот репозиторий содержит frontend, написанный на **React**, с функциональностью:

- Динамическую карту с помощью **Leaflet** (**OpenStreetMap**);
- JWT аутентификация и ability-based авторизация с помощью **CASL**;
- Интерфейс для взаимодействия с Records - в т.ч. создание, редактирование, загрузка фотографий с тифлокомментариями, удаление, поиск, пагинация.

---

## Стек технологий

- ![React][React]
- ![TypeScript][TypeScript]
- ![Bun][Bun]
- ![Vite][Vite]
- ![ESLint][ESLint]
- ![Redux][Redux] (+ **RTK Query**)
- ![CASL][CASL]

---

## Локальный запуск

Инструкция по локальному поднятию:

### Предварительные требования

1. **Окружение**:

- **Node.js (>=18)** или **Bun** (рекомендуется)

### Инициализация и запуск

0. Клонировать репозиторий:

   ```sh
   git clone https://github.com/lavrentious/tgrfront.git
   ```

1. Установить зависимости:

   ```sh
   bun install
   ```

2. Создать и заполнить `.env.development`/`.env.production` файл на основе [.env.example](./.env.example):

   Указать:
   - URL бекенда

3. Запуск dev-сервера

   ```sh
   bun run dev
   ```

Dev-сервер фронта будет доступен на `http://localhost:8080`.

---

## Публикации

- Публикация на сайте организации **Камерата** - <a href="https://kamerata.org/tifloguide">ссылка</a>;
   > Проект был представлен в 2021г на форуме туристических практик для инвалидов по зрению
- Публикация на сайте Бийского филиала ЦРС ВОС - <a href="http://new.crsnaumova.ru/index.php/it-platforma-tiflogid">ссылка</a>;
- Отчет о реализации проектов в Нижнем Новгороде - <a href="https://asi.org.ru/2023/06/13/v-nizhnem-novgorode-dlya-lyudej-s-narusheniyami-zreniya-podgotovili-turisticheskie-programmy/">ссылка</a>.

## Лицензия

Проект распространяется под лицензией MIT (см. [LICENSE](./LICENSE)).

---

## Контакты

Автор — **lavrent** — <a href="https://lavrentious.ru">lavrentious.ru</a>

Репозиторий: [https://github.com/lavrentious/tgrfront](https://github.com/lavrentious/tgrfont)

Репозиторий бекенда: [https://github.com/lavrentious/tgrapi](https://github.com/lavrentious/tgrapi)

[product-screenshot]: images/screenshot.png
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[NodeJS]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Bun]: https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff&style=for-the-badge
[Vite]: https://img.shields.io/badge/Vite-00BFFF.svg?style=for-the-badge&logo=vite&logoColor=white
[React]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[ESLint]: https://img.shields.io/badge/ESLint-4C52AD?style=for-the-badge&logo=eslint&logoColor=white
[Redux]: https://img.shields.io/badge/redux-%23494D4D.svg?style=for-the-badge&logo=redux&logoColor=white
[CASL]: https://img.shields.io/badge/CASL-%230a0a0a.svg?style=for-the-badge&logoColor=f69220&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACrUExURUxpcb2+v4aGh9PT1LS1uFtZW/Dw8GBfYJCQk/Lz81dYWoiIitrc31ZYW9HS00pKTdDR0t7h429wc3x+gKmqrNvg5GBhZOnr7YiJi2BhY3R2eNvc3LS2t1FTVuDg4d3d3lVXW21ub9jd4h0YGSEcHTQxMmhnaHp6fC0pKkE+P1VTVFBNT3Fxc8/Q0igjJNrc3+Pm6Ts3OcbGyCMgIUpHSaqpq0ZCRJ+foYOEht5QpOEAAAAjdFJOUwAiB079/+P+/fwrFI/fb0g43GzdTaWPvErAra9isbXPvdu/9PobLQAAAdtJREFUOMt9k9eCmzAQRemS1pjgEjtbUlEviI7//8vCUoztzeY+MoeZO0WOs8hz/ST+OihOjq7nPMp9e40QKqwx1gTw98t+cxfeJDtbVD0DqukaJUNJ4eEWSc+oYorwOpuFecjor6cl7keWCcCkasp8BkpCKN1+mcvvjFStrRjToZgIHFJFgH6ecviWqsoWpu8hAyUeAUkpIIxNKXwEqLHWVlUAteIjoAAARIMFoKAytiiKqr2EZALCMLwCKWIqGACEzBVopJScgcmDG0HRVmORnskJ6JRqONtOwCZqCQwGB0ELaTO2UXdNIwjbTrPyfgSc9m0A4UVLMnZRi64jAj7PK4mt6C4QagoUmYaZCyFyqU/LJBHNqWZSlBxPk8zLssR0buLdZY8bMMwIL7sYAJ7r7bIM72wIl7LMruKEYKG/X68iQTQTStwCPANgv15L1NZ5J/C6bY75WuG9DyMzMm9yBOpMXU43F5VGQY4JX4A6z/K7BI4XDy7qFcCZYqe7ozxGpszwjUt9+HYHeAnq6zWOJds/XP7mFbEVEPRl8+Fh/DR0iZfs8PTh5TjHnQHz/5cHA+v1j0QD4dH5p5LIaoxBELw5n8jfWQjtznc+VfqnKM6p8x+5cezef/kLIPhUGL5FhJAAAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII=
