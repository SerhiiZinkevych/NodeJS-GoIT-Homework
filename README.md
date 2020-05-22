Домашнее задание 2.

REST API поддерживает следующие рауты.

@ GET /api/contacts<br/>
возвращает массив всех контактов в json-формате со статусом 200<br/>

@ GET /api/contacts/:contactId<br/>
Не получает body<br/>
Получает параметр contactId<br/>
если такой id есть, возвращает обьект контакта в json-формате со статусом 200<br/>
если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404<br/>

@ POST /api/contacts<br/>
Получает body в формате {name, email, phone}<br/>
Валидация с помощью @hapi/joi<br/>
Если в body нет каких-то обязательных полей, возарщает ошибку от joi co статусом 400<br/>
Если с body все хорошо, добавляет уникальный идентификатор в обьект контакта<br/>
Вызывает функцию addContact() для сохранения контакта в файле contacts.json<br/>
По результату работы функции возвращает обьект с добавленным id {id, name, email, phone} и статусом 201<br/>

@ DELETE /api/contacts/:contactId<br/>
Не получает body<br/>
Получает параметр contactId<br/>
вызывает функцию removeContact для работы с json-файлом contacts.json<br/>
если такой id есть, возвращает json формата {"message": "contact deleted"} и статусом 200<br/>
если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404<br/>

@ PATCH /api/contacts/:contactId<br/>
Получает body в json-формате c обновлением любых полей name, email и phone<br/>
Если body нет, возарщает json с ключом {"message": "missing fields"} и статусом 400<br/>
Если с body все хорошо, вызывает функцию updateContact для обновления контакта в файле contacts.json<br/>
По результату работы функции возвращает обновленный обьект контакта и статусом 200. В противном случае, возвращает json с ключом "message": "Not found" и статусом 404<br/>

Для проверки задеплоил на heroku -> https://rocky-thicket-38466.herokuapp.com/api/contacts
