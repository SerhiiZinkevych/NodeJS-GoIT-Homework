const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("./contacts.model");

const {
  validateUpdateContact,
  validateCreateContact,
} = require("./contacts.validator");

module.exports = class ContactsController {
  static async getContacts(req, res) {
    const contacts = await listContacts();
    return res.status(200).json(contacts);
  }

  static async getContactById(req, res) {
    const id = parseInt(req.params.contactId);
    const contact = await getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }

  static async createContact(req, res) {
    const result = validateCreateContact(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    } else {
      const newContact = await addContact(...Object.values(req.body));
      if (newContact) {
        res.status(201).json(newContact);
      } else {
        res.status(500).send("Error while adding new contact");
      }
    }
  }

  static async deleteContactById(req, res) {
    const id = parseInt(req.params.contactId);
    const contact = await removeContact(id);
    if (contact) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }

  static async updateContactById(req, res) {
    const id = parseInt(req.params.contactId);

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }

    const result = validateUpdateContact(req.body);

    if (result.error) {
      return res.status(400).send(result.error);
    }

    const contact = { id, ...req.body };
    const updatedContact = await updateContact(contact);
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  }
};
