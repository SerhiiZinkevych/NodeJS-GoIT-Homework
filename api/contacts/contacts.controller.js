const contactModel = require("./contacts.model");

module.exports = class ContactsController {
  static async getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();
      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  static async getContactById(req, res, next) {
    const id = req.params.contactId;

    try {
      const contact = await contactModel.findById(id);
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (err) {
      next(err);
    }
  }

  static async createContact(req, res, next) {
    try {
      const newContact = await contactModel.create(req.body);
      if (newContact) {
        res.status(201).json(newContact);
      } else {
        res.status(500).send("Error while adding new contact");
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteContactById(req, res, next) {
    try {
      const id = req.params.contactId;
      const deletedContact = await contactModel.findByIdAndDelete(id);
      if (!deletedContact) {
        res.status(404).json({ message: "Not found" });
      }
      res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async updateContactById(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "missing fields" });
      }

      const id = req.params.contactId;
      const updatedContact = await contactModel.findContactByIdAndUpdate(
        id,
        req.body
      );

      if (!updatedContact) {
        res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(updatedContact);
    } catch (err) {
      next(err);
    }
  }
};
