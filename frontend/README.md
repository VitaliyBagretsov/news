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

- `/` — список медиа;
- `/news/:mediaId` — новости выбранного медиа;
- остальные адреса перенаправляются на `/`.

Основные проверки:

```bash
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
```
