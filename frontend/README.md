# News frontend

React-приложение использует:

- Axios для HTTP-запросов к News backend;
- TanStack React Query для серверного состояния и кэширования;
- Zustand для клиентского состояния;
- React Router для маршрутизации;
- SCSS и SCSS Modules для стилей.

Vite читает переменные из корневого файла `../.env`. Адрес backend задаётся
переменной `VITE_API_URL`.

```bash
cd frontend
npm install
npm run dev
```

Маршруты приложения:

- `/login` — публичная страница входа;
- `/` — главная страница;
- `/media` — список медиа;
- `/media/:mediaId/news` — новости выбранного медиа;
- остальные адреса открывают страницу `not-found`.

Все страницы, кроме `/login`, отображаются внутри общей root-страницы с верхней
навигацией и областью для вложенного маршрута (`Outlet`).

Страница media использует widget `MediaList`. Он одним запросом получает список
источников вместе с агрегированной статистикой и передаёт данные в
entity-компонент `MediaCard`. Карточка показывает общее число новостей,
публикации за последние 24 часа и время последней публикации.

Маршруты с данными защищены проверкой `GET /auth/session`. Axios отправляет
только `HttpOnly` session cookie (`withCredentials: true`); токены Keycloak во
frontend не передаются и не сохраняются. Глобальный response interceptor при
любом ответе `401` переводит пользователя на `/login` и запоминает исходный
адрес для возврата после успешного входа.

Основные проверки:

```bash
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
```
