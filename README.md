Реализация простого CRUD api на nodeJS

* Скрипты:
  - npm run start:dev для разработки однопоточного режима
  - npm run start:prod для сборки однопоточного режима
  - npm run start:dev:multi для разработки многопоточного режима
  - npm run start:prod:multi для сборки многопоточного режима
  - npm run test прогон тестов

* Эндпоинты:
    - **GET** `api/users` для получения всех пользователей
        - Серевер должен отправить ответ с `status code` **200** и всеми пользователями.
    - **GET** `api/users/{userId}` 
        - Серевер должен отправить ответ с `status code` **200** and record with `id === userId` if it exists
        - Серевер должен отправить ответ с `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Серевер должен отправить ответ с `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **POST** `api/users` для создания записи о новом пользователе
        - Серевер должен отправить ответ с `status code` **201** и новосозданным пользователем
        - Серевер должен отправить ответ с `status code` **400** и соответствующим сообщением если `body` не содержит **необходимых** полей
    - **PUT** `api/users/{userId}` для изменения записи о пользователе
        - Серевер должен отправить ответ с `status code` **200** и измененная запись
        - Серевер должен отправить ответ с `status code` **400** и соответствующим сообщением если `userId` невалиден (не `uuid`)
        - Серевер должен отправить ответ с `status code` **404** и соответствующим сообщением если запись с `id === userId` не существует
    - **DELETE** `api/users/{userId}` для удаления записи о пользователе
        - Серевер должен отправить ответ с `status code` **204** если запись найдена и удалена
        - Серевер должен отправить ответ с `status code` **400** и соответствующим сообщением если `userId` невалиден (не `uuid`)
        - Серевер должен отправить ответ с `status code` **404** и соответствующим сообщением если запись с `id === userId` не существует

Задача была взята [здесь](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)
