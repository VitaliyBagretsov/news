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

### Форматирование

Общие правила Prettier для backend и frontend находятся в корневом файле
`.prettierrc.json`. Они явно фиксируют ширину строки 100 символов, отступ в два
пробела, точки с запятой, одинарные кавычки, trailing commas и окончания строк
LF.

Проверить форматирование всего проекта без изменения файлов:

```bash
npm run format:check
```

Применить форматирование:

```bash
npm run format
```

Backend использует нативные package aliases Node.js с обязательным префиксом
`#` только для публичных feature entrypoints (`#auth`, `#common`, `#media`,
`#news`, `#users`) и общего семейства исключений `#exceptions/*`. Внутренние
файлы, entities, DTO, types, constants и utils используют относительные
ESM-импорты. Frontend использует alias `@/`, который одинаково настроен в
`frontend/tsconfig.json` и `frontend/vite.config.ts`.

### Автоматические проверки

Из корня репозитория доступны единые команды для backend и frontend:

```bash
npm run typecheck
npm run lint
npm test
```

ESLint работает в проверочном режиме и не изменяет файлы. Для явного
автоматического исправления отдельного приложения используйте его команду
`npm run lint:fix`.

Husky устанавливается корневой командой `npm install`; script `prepare`
настраивает Git hooks. Перед каждым commit файл `.husky/pre-commit`
последовательно запускает typecheck, ESLint и unit-тесты backend и frontend. Если
любая проверка завершается с ошибкой, commit не создаётся.

## Локальные контейнеры

`docker-compose.yml` запускает PostgreSQL и News backend. Frontend пока не входит
в Compose и продолжает запускаться отдельно. Backend собирается многоэтапным
Dockerfile на Node.js 22, ожидает готовности PostgreSQL и предоставляет
healthcheck `GET /api/health`.

### Переменные окружения

Compose читает настройки из корневого файла `.env`. Этот файл игнорируется Git,
поскольку может содержать секреты. Шаблон допустимых переменных хранится в
`.env.example`.

Этот же корневой `.env` читает backend. Для подключения к PostgreSQL используются
`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER` и
`POSTGRES_PASSWORD`. При локальном запуске backend значение `POSTGRES_HOST`
равно `localhost`; внутри Compose оно переопределяется именем сервиса `postgres`.

Авторизация backend использует Keycloak по протоколу OpenID Connect. Все
настройки, включая `KEYCLOAK_CLIENT_SECRET` и `SESSION_SECRET`, задаются в том
же корневом `.env`. В репозиторий попадают только безопасные примеры из
`.env.example`.

Для первоначальной настройки скопируйте шаблон и задайте локальный пароль:

```bash
cp .env.example .env
```

### Запуск только PostgreSQL

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
`docker/postgres/init`, создаёт схему `news` и начальные таблицы. Локально
`TYPEORM_SYNCHRONIZE=true` разрешает TypeORM синхронизировать учебную схему с
entities. В production синхронизация отключена.

### Запуск PostgreSQL и backend

```bash
npm run compose:check
npm run stack:up
npm run stack:status
curl http://localhost:3000/api/health
```

Совместные логи backend и PostgreSQL:

```bash
npm run stack:logs
```

Остановка с сохранением volume:

```bash
npm run stack:down
```

### Остановка

Остановить PostgreSQL, сохранив данные:

```bash
npm run db:down
```

Удалить контейнер вместе с локальными данными:

```bash
docker compose down --volumes
```

Последняя команда необратимо удаляет локальную базу и используется только когда
данные больше не нужны.

## Автономный сбор новостей

Единственный источник списка сайтов для сбора — таблица `news.media`. Backend
выбирает из неё записи с `isActive=true`; URL должен соответствовать одному из
технических описаний селекторов в `parserConfig`. Если `PARSER_RUN_ON_START=true`,
первый сбор начинается сразу после готовности приложения. Далее Nest scheduler
запускает сбор каждые пять минут.

```dotenv
PARSER_MAX_ARTICLES_PER_RUN=20
PARSER_RUN_ON_START=true
```

За один проход backend:

1. читает активные записи `news.media`;
2. получает уникальные ссылки на статьи и ограничивает их количество;
3. пропускает уже сохранённые пары `mediaId + externalCode`;
4. сохраняет каждую новость, её ссылки и изображения в одной транзакции;
5. записывает отдельные ошибки статей в `news.log` и продолжает остальные;
6. не начинает новый проход, пока предыдущий не завершён.

Сетевые запросы имеют тайм-аут 15 секунд и проверяют HTTP status. Ручные
диагностические endpoints `/api/test` и `/api/write-news` удалены: сбор является
внутренней фоновой задачей. Актуальные селекторы RT были проверены на главной
странице и отдельной статье.

Локальная таблица `news.user` остаётся таблицей профилей с полями `id`, `name` и
`email`. Поля `password` и `refreshToken`, локальное хеширование и скрывающий
пароли interceptor удалены. Учётные данные и токены авторизации принадлежат
Keycloak и серверной таблице сессий, а не `news.user`.

## Подготовка production Compose

`docker-compose.prod.yml` предназначен для будущего запуска backend и PostgreSQL
на ВМ. PostgreSQL не публикует порт на хост, backend доступен только на
`127.0.0.1:${BACKEND_HOST_PORT}` и в дальнейшем должен быть подключён к общему
Nginx. Production secrets находятся только в `.env.prod`, шаблон — в
`.env.prod.example`.

```bash
cp .env.prod.example .env.prod
npm run compose:prod:check
npm run stack:prod:up
npm run stack:prod:status
npm run stack:prod:logs
```

На новом volume таблицы создаются SQL-файлами из `docker/postgres/init`, а
`TYPEORM_SYNCHRONIZE=false` запрещает автоматическое изменение production-схемы.
Для обновления уже существующего production volume перед первым развёртыванием
потребуется отдельная миграция; удалять volume для обновления схемы нельзя.

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
