# Сборщик проектов

## Установка

Требуются установленный [git](https://git-scm.com/) и [Node.js (LTS)](https://nodejs.org/en/) не ниже 18 версии

1. Открыть терминал, попасть в папку проектов, клонировать этот репозиторий (дополнительные настройки для VS Code на Windows смотрите ниже).
2. Перейти в папку нового проекта (пример — `cd my-new-project`).
3. Удалить историю разработки: `rm -rf .git`
4. Установить зависимости проекта: `npm i`.

В редакторе кода или IDE установить (если не установлены) и включить плагины [EsLint](https://eslint.org/), [Stylelint](https://stylelint.io/), [EditorConfig](https://editorconfig.org/) и [Prettier](https://prettier.io/).

## Настройка для VS Code на Windows:

1. Настройки Git: `git config --global core.autocrlf input`
2. Склонировать репозиторий
3. Настройки VS Code:
- `Files: EOL` — `\n`,
- `Editor: Default Formatter` — `Prettier — Code formatter`
4. Настройки плагина Prettier:
- `Prettier: End of Line` — `lf`,
- `Prettier: Config Path` — `.prettierrc.json`
5. Настройки плагина EditorConfig: `Generate Auto` — `false`

Автоформатирование доступно по сочетанию клавиш — Shift + Alt + F (можно настроить форматирование при сохранении файла).

## Команды

```bash
npm run start         # запуск сервера разработки
npm run deploy        # отправка содержимого папки сборки на gh-pages (нужен репозиторий на github.com)
npm run build         # сборка без запуска сервера разработки
npm run test          # проверка всех [pug- | html-], scss- и js-файлов на соответствие правилам (см. [.pug-lintrc | html-linter.json], .stylelintrc и eslintrc соответственно)
npm run test:pug      # проверить только pug-файлы (pug версия сборщика)
npm run test:html     # проверить только html-файлы (html версия сборщика)
npm run test:style    # проверить только scss-файлы
npm run test:js       # проверить только js-файлы
npx fix:style         # исправить только scss-файлы
npx fix:js            # исправить только js-файлы
npx prettier:js       # проверить только js-файлы через Prettier
npx prettier-fix:js   # исправить только js-файлы через Prettier

```

## Динамические пути для сборки для бэкенда

`config.js` содержит в себе настройки для сборки проекта. Изменения в этом файле не отслеживаются, поэтому после внесения изменений следует перезапустить сборку.

Переменная `pathToPrefix` содержит в себе префикс путей для размещения собранных файлов в папке `build`.

Объект `htmlPathObj` и `cssPathObj` содержит в себе пути для указания собранных файлов. Изменение путей (при указании путей через переменные) приведёт к изменению путей в итоговых html и css файлах. В объекте `htmlPathObj` лежат пути для разметки:
* js: ``,
* css: ``,
* img: ``,
* fonts: ``

В объекте `cssPathObj` лежат пути для стилей:
* css: ``,
* img: ``,
* fonts: ``

## Структура

```bash
build/       # Папка сборки (результат работы над проектом)
src/         # Исходники
  assets/    # Файлы контента (то, что загружается пользователем)
  blocks/    # Блоки (подпапки с блоками)
  data       # Папка с базой данных json
  favicon/   # Фавиконки (копирование прописать в config.js)
  fonts/     # Шрифты (копирование прописать в config.js, подключение в src/blocks/page/page.scss)
  img/       # Общие изображения
  js/        # Общие js-файлы, в т.ч. точка сборки для webpack и общие модули
  json/      # Служебная папка для сборки страниц с json
  pages/     # Страницы проекта (при компиляции: src/pages/index.[pug | html | hbs] → build/index.html)
  templates/ # Служебные [pug- | html- | hbs-] файлы (шаблоны страниц, примеси)
  scss/      # Служебные стилевые файлы (диспетчер подключений, переменные, примеси)
  symbols/   # Иконки для svg-спрайта
```
