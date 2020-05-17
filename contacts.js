const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");

const contactsPath = path.join(__dirname, "db/contacts.json");

// Получить список всех контактов из файла db/contacts.json
async function listContacts() {
  try {
    const data = await fsPromises.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
}

// Получить контакт по ID. Если не найден вернется undefined.
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    return contacts.find((contact) => contact.id === contactId);
  } catch (err) {
    console.error(err);
  }
}

// Удалить контакт по ID. Возвращает объект удаленного контакта или undefined если контакта с contactId не найдено.
async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const contactToDelete = await getContactById(contactId);
    if (contactToDelete) {
      const filteredList = contacts.filter(
        (contact) => contact.id !== contactId
      );
      await fsPromises.writeFile(contactsPath, JSON.stringify(filteredList));
      return contactToDelete;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
  }
}

// Добавить новый контакт в файл db/contacts.json. Возвращает объект записанного контакта.
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const currMaxId = Math.max(
      ...contacts.map((contact) => Number(contact.id))
    );
    const newContact = {
      id: currMaxId + 1,
      name: name,
      email: email,
      phone: phone,
    };
    const newList = [...contacts, newContact];
    await fsPromises.writeFile(contactsPath, JSON.stringify(newList));
    return newContact;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { listContacts, getContactById, addContact, removeContact };
