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

`BACKEND_PORT` — единый порт Nest-приложения: его используют сам backend,
публикация порта Docker Compose, container healthcheck и локальная коллекция
Bruno. Переменная обязательна; скрытого значения по умолчанию в Compose нет.

Для одновременной работы контейнерного и напрямую запущенного backend сначала
задайте `BACKEND_PORT=3000` и создайте контейнеры командой `npm run stack:up`.
После их запуска измените значение в локальном `.env` на `BACKEND_PORT=3001` и
запустите разрабатываемый backend командой `npm run back:dev`. Уже созданный
контейнер продолжит слушать порт `3000`, а локальный процесс займёт `3001`.
Повторный `docker compose up` после подмены значения может пересоздать контейнер
уже с портом `3001`; перед обновлением Docker-стека верните в `.env` значение
`3000`.

Frontend Vite читает этот же корневой `.env` и отправляет запросы по адресу из
`VITE_API_URL`. Для backend, запущенного напрямую, используйте
`http://localhost:3001/api`; для контейнерного backend — порт `3000`.
Production-шаблон использует внешний префикс `/news/api`.

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
set -a; source .env; set +a
curl "http://localhost:${BACKEND_PORT}/api/health"
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

`docker-compose.prod.yml` предназначен для запуска PostgreSQL, backend и
frontend на ВМ. PostgreSQL не публикует порт на хост, а frontend вообще не
публикует отдельный порт ВМ. Backend оставляет локальный диагностический порт
`127.0.0.1:${BACKEND_PORT}`. Для внешнего доступа backend и frontend входят в
общую с reverse proxy сеть `GATEWAY_NETWORK`. Production secrets находятся
только в `.env.prod`, шаблон — в `.env.prod.example`. Compose запускает готовые
образы из `NEWS_BACKEND_IMAGE` и `NEWS_FRONTEND_IMAGE`.

```bash
cp .env.prod.example .env.prod
npm run compose:prod:check
npm run stack:prod:up
npm run stack:prod:status
npm run stack:prod:logs
```

### Последовательность доработки и выпуска

Обычный цикл разработки и доставки изменений выполняется небольшими этапами.

1. Перед началом работы обновить локальный `main` и создать тематическую ветку:

   ```bash
   git switch main
   git pull --ff-only origin main
   git switch -c feature/short-description
   ```

2. Доработать backend или frontend и сначала проверить результат без Docker.
   Для полного набора локальных проверок из корня репозитория выполнить:

   ```bash
   npm run format:check
   npm run typecheck
   npm run lint
   npm test
   ```

3. Проверить контейнерный запуск локально. При обычной разработке `.env`
   содержит `BACKEND_PORT=3000`; если backend одновременно запускается напрямую,
   значение временно меняется на `3001`:

   ```bash
   npm run compose:check
   npm run stack:up
   npm run stack:status
   ```

4. Проверить основные пользовательские сценарии через браузер или коллекцию
   Bruno: вход, session, чтение media и news, а для роли `admin` — изменение
   media. После проверки создать commit, отправить ветку и слить pull request в
   `main`. Прямое развёртывание feature-ветки на production не выполняется.

5. Если меняется схема или справочные данные PostgreSQL, до релиза подготовить
   отдельный идемпотентный SQL-файл миграции и сделать backup production-базы.
   Файлы `docker-entrypoint-initdb.d` не выполняются повторно на существующем
   volume, а `TYPEORM_SYNCHRONIZE` в production всегда остаётся `false`.

6. После слияния подключиться к ВМ и запустить единый скрипт релиза:

   ```bash
   ssh vitaliy@158.160.205.151
   cd /opt/news
   ./scripts/deploy-prod.sh
   ```

7. Проверить контейнеры, внутренние healthcheck и публичные HTTPS-маршруты:

   ```bash
   docker compose --env-file .env.prod -f docker-compose.prod.yml ps
   curl -fsS http://127.0.0.1:3000/api/health
   curl -fsS https://vitaliy-vm.duckdns.org/news/api/health
   curl -I https://vitaliy-vm.duckdns.org/news/
   ```

8. Выполнить короткий production smoke-test в браузере. Только после него можно
   удалить заведомо неактуальные образы и build cache. Именованный PostgreSQL
   volume при очистке Docker не удалять.

Обычный релиз News не требует обновлять `keycloak-project`. Отдельный релиз
Keycloak/Nginx нужен только при изменении realm, клиента, сертификатов, общей
Docker-сети или публичных маршрутов `/keycloak/`, `/news/` и `/news/api/`.

### Обновление production на ВМ

После первичной настройки `.env.prod` дальнейшее развёртывание запускается из
корня клонированного репозитория:

```bash
cd /opt/news
./scripts/deploy-prod.sh
```

Команда `npm run deploy:prod` является эквивалентным сокращением, если npm
установлен на хосте. Сам скрипт требует только Bash, Git, Docker и `awk`; Node.js
для работы production-хоста не нужен, поскольку сборка выполняется в Docker.

Скрипт `scripts/deploy-prod.sh`:

1. проверяет наличие `.env.prod`, ветку `main` и отсутствие изменений в
   отслеживаемых файлах;
2. выполняет `git pull --ff-only origin main`;
3. собирает на ВМ `news-backend:<commit SHA>` и `news-frontend:<commit SHA>`;
4. собирает frontend с базовым URL `/news/` и API URL из `VITE_API_URL`;
5. записывает теги образов в `.env.prod`, не изменяя остальные секреты;
6. создаёт при отсутствии общую Docker-сеть `GATEWAY_NETWORK`;
7. проверяет Compose, обновляет сервисы и ждёт успешных healthcheck;
8. при неудачном запуске возвращает предыдущие образы, если они были указаны.

Скрипт не удаляет образы и build cache автоматически. Их следует очищать
отдельно после проверки работающего релиза. PostgreSQL не пересоздаётся, если
его конфигурация не изменилась, а данные остаются в именованном volume.

Если новый контейнер не проходит healthcheck, скрипт пытается восстановить
предыдущие теги образов автоматически. Для ручной диагностики используются:

```bash
docker logs --tail 100 news-backend
docker logs --tail 100 news-frontend
docker logs --since 30m keycloak-proxy 2>&1 |
  awk '$7 ~ /^\/news\/api\// && $9 >= 400'
```

На новом volume таблицы создаются SQL-файлами из `docker/postgres/init`, а
`TYPEORM_SYNCHRONIZE=false` запрещает автоматическое изменение production-схемы.
Файл `03-seed-media.sql` добавляет RT, РИА Новости и CNews непосредственно в
`news.media`; далее источники управляются только записями этой таблицы. Для всех
трёх источников в backend определены parser-конфигурации.
Создание источника выполняется через `POST /api/media` и доступно пользователю с
ролью `admin`. Endpoint принимает название, URL сайта, признак активности и
необязательные сведения о редакции, включая URL логотипа, и возвращает созданную
запись `news.media`.
Редактирование выполняется через защищённый ролью `admin` endpoint
`PATCH /api/media/:id`; в ответ backend возвращает обновлённую запись.
Чтение media через `GET /api/media`, `GET /api/media/all` и
`GET /api/media/:id` разрешено ролям `user` и `admin`.
Элементы ответа `GET /api/media` дополнены общим количеством новостей,
количеством публикаций за последние 24 часа и датой последней публикации.
Источники без новостей также получают нулевые показатели.
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
