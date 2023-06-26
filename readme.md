# Сервис для распределения задач между студентами по алгоритмам *Algos*

## Установка:
requirments + pip install uvicorn <br />
Запуск локально: uvicorn src.main:app --reload

## Чтоб запустить в интернете для теста:
Сначала "npm install -g localtunnel" <br />
Затем "lt --local-host 127.0.0.1 --port 8000" <br />
Там выдаст ссылку, по которой надо будет ввести свой IP

## Redis for windows:
https://github.com/tporadowski/redis/releases

## Creating DB
alembic revision --autogenerate -m "Database created" <br />
alembic upgrade head
