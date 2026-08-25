# News

Учебный проект для поэтапного освоения локальной контейнеризации и DevOps-практик.

## Среда разработки

Проект зафиксирован на Node.js 22 и npm 10. При использовании `nvm` нужная
версия выбирается из корневого файла `.nvmrc`:

```bash
nvm use
```

Backend компилируется TypeScript 6.0.3 с целью ES2023, соответствующей Node.js
22, и использует нативные ECMAScript modules. В `backend/package.json`
установлено `type: module`, а TypeScript работает в режимах `module: NodeNext`
и `moduleResolution: NodeNext`. Внутренние package imports имеют префикс `#`,
а относительные ESM-импорты содержат расширение `.js`, которое соответствует
файлам после компиляции в `dist`.

Зависимости backend устанавливаются воспроизводимо командой:

```bash
cd backend
npm ci
npm run build
```

## Этап 1: локальный PostgreSQL

На текущем этапе в `docker-compose.yml` активен только PostgreSQL. Остальные
сервисы закомментированы и будут подключаться по одному после отдельной проверки.

### Переменные окружения

Compose читает настройки из корневого файла `.env`. Этот файл игнорируется Git,
поскольку может содержать секреты. Шаблон допустимых переменных хранится в
`.env.example`.

Этот же корневой `.env` читает backend. Для подключения к PostgreSQL используются
`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER` и
`POSTGRES_PASSWORD`. При локальном запуске backend значение `POSTGRES_HOST`
равно `localhost`; после включения backend в Compose оно будет переопределено на
имя сервиса `postgres`.

Авторизация backend использует Keycloak по протоколу OpenID Connect. Все
настройки, включая `KEYCLOAK_CLIENT_SECRET` и `SESSION_SECRET`, задаются в том
же корневом `.env`. В репозиторий попадают только безопасные примеры из
`.env.example`.

Для первоначальной настройки скопируйте шаблон и задайте локальный пароль:

```bash
cp .env.example .env
```

### Запуск и проверка

```bash
npm run compose:check
npm run db:up
npm run db:status
npm run db:check
```

Подключение к `psql` внутри контейнера:

```bash
npm run db:psql
```

Посмотреть поток логов PostgreSQL можно командой `npm run db:logs`. Для выхода
из просмотра логов нажмите `Ctrl+C` — сам контейнер продолжит работать.

PostgreSQL доступен с хоста по адресу `localhost:5432`. Данные сохраняются в
именованном Docker volume `news_news_postgres_data`.

При первой инициализации нового volume PostgreSQL выполняет SQL-файлы из
`docker/postgres/init` и создаёт схему `news`, используемую TypeORM-сущностями.

### Остановка

Остановить контейнер, сохранив данные:

```bash
npm run db:down
```

Удалить контейнер вместе с локальными данными:

```bash
docker compose down --volumes
```

Последняя команда необратимо удаляет локальную базу и используется только когда
данные больше не нужны.

## Этап 2: локальная авторизация через Keycloak

News backend работает как BFF (Backend for Frontend). Браузер получает только
cookie `news_session` с непрозрачным идентификатором сессии. Access, refresh и
ID tokens не передаются frontend и хранятся на стороне backend в таблице
`news.user_sessions` PostgreSQL. Таблица создаётся автоматически библиотекой
хранилища сессий при первом запуске backend.

Frontend отправляет логин и пароль только в News backend. Backend использует
OAuth 2.0 Resource Owner Password Credentials Grant для проверки данных в
Keycloak. Пользователь и frontend не открывают страницы Keycloak и не получают
его токены. Пароль существует только во время запроса и не записывается ни в
сессию, ни в базу, ни в ответ.

Для этого у конфиденциального клиента `news-client` должна быть включена
настройка Direct Access Grants. Роли `admin`, `user` и `guest` backend читает
из client roles этого клиента. Собственные JWT News и Bearer-токены в HTTP API
не применяются.

Профиль каждого пользователя Keycloak должен быть полностью заполнен. В
частности, для импортируемых учебных пользователей задаются `firstName` и
`lastName`; иначе Password Grant отвечает `invalid_grant: Account is not fully
set up`, даже когда список `requiredActions` пуст.

### Переменные авторизации

Для локального запуска заполните в корневом `.env`:

```dotenv
SESSION_SECRET=<случайная строка длиной не менее 32 символов>
SESSION_COOKIE_SECURE=false

KEYCLOAK_ISSUER_URL=http://localhost:8080/realms/news-realm
KEYCLOAK_CLIENT_ID=news-client
KEYCLOAK_CLIENT_SECRET=<секрет локального клиента news-client>
```

Секрет `KEYCLOAK_CLIENT_SECRET` должен совпадать с `NEWS_CLIENT_SECRET` того
экземпляра `keycloak-project`, который импортировал realm. Для production
issuer должен быть HTTPS-адресом, а `SESSION_COOKIE_SECURE` должен иметь
значение `true`.

### Маршруты auth

- `POST /api/auth/login` — принимает `{ "username": "...", "password": "..." }`,
  проверяет данные через Keycloak и создаёт серверную сессию. Возвращает только
  безопасный профиль пользователя и устанавливает `HttpOnly` cookie.
- `GET /api/auth/session` — возвращает только профиль и роли текущего
  пользователя, без токенов.
- `POST /api/auth/logout` — отзывает refresh token в Keycloak, удаляет
  серверную сессию и возвращает `{ "authenticated": false }`.

Защищённые операции `media` используют серверную сессию и client roles;
контроллер `users` требует сессию. Чтение `news` остаётся публичным.

Для запросов frontend должен включать cookies (`credentials: 'include'`). CORS
backend разрешает credentials для локальных адресов frontend, а cookie имеет
`HttpOnly` и `SameSite=Lax`.

### Коллекция Bruno

Коллекция находится в корневой папке `bruno`. Откройте в Bruno файл
`bruno/opencollection.yml`. Папка `auth` содержит запросы login, session и
logout. Перед запуском Bruno задайте локальные переменные `NEWS_USERNAME` и
`NEWS_PASSWORD`, перечисленные в `bruno/.env.example`. Bruno сохраняет cookie
между запросами коллекции, поэтому после login можно сразу вызвать session и
защищённые endpoints.
