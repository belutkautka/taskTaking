# Сервис для проведения *CTF*

## Что из себя представляет:
Это сайт на котором каждый сможет провести свой CTF,
выложить таски и автоматически или с помощью модерации обрабатывать
ввод участников. Вся статистика отображается в профиле и всегда с помощью
уведомлений можно узнать, когда появились баллы

## Чтоб запустить в интернете для теста:
Сначала "npm install -g localtunnel" <br />
Затем "lt --local-host 127.0.0.1 --port 8000" <br />
Там выдаст ссылку, по которой надо будет ввести свой IP

## Redis for windows:
https://github.com/tporadowski/redis/releases

## Creating DB
alembic revision --autogenerate -m "Database created" <br />
alembic upgrade head
