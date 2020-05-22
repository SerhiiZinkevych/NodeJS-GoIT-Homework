const { Router } = require("express");
const {
  getContacts,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
} = require("./contacts.controller");

const contactsRouter = Router();

contactsRouter.get("/", getContacts);

contactsRouter.get("/:contactId", getContactById);

contactsRouter.post("/", createContact);

contactsRouter.delete("/:contactId", deleteContactById);

contactsRouter.patch("/:contactId", updateContactById);

module.exports = contactsRouter;
