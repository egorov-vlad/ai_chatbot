# WinBot AI 
[WinBot](https://win-bot.ru/) - это виртуальный gpt бот-ассистент для зрителей киберспортивных трансляций, которые осуществляют ставки

Релиз активации состоялся на трансляциях PARAGON Events в рамках квалификаций Восточной и Западной Европы к The International 2024 по Dota 2 в июне.

[Кейс](https://t.me/TEAMMATEagency/1406)

# Итоговые предикты:
![image](https://github.com/user-attachments/assets/1f25bdb5-401e-46ed-8025-3148a7f7e1d3)

# Реализованный функционал
1. API для взаимодействия с фронтендом 
2. Парсеры с различных сервисов по сбору статистики для Dota 2(Stratz, Pandascore) для получения информации и передачи в обученную модель GPT
3. Redis, для кэширования запросов
4. Модуль для взаимодействия с AI ассистентами

## Used stack:

- TypeScript
- [bun](https://bun.sh)
- [ElysiaJS](https://elysiajs.com/)
- [Redis](https://redis.io/)
- OpenAI 

## Примечание 
Из проекда удалены промпты для обученных моделей

## To run the bot in development mode:

```bash
bun run dev
```

## To run the bot in production mode:

```bash
bun run start
```

