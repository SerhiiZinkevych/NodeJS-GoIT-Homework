const { Router } = require("express");
const {
  getContacts,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
} = require("./contacts.controller");

const {
  validateId,
  validateCreateContact,
  validateUpdateContact,
} = require("./contacts.validator");

const contactsRouter = Router();

contactsRouter.get("/", getContacts);

contactsRouter.get("/:contactId", validateId, getContactById);

contactsRouter.post("/", validateCreateContact, createContact);

contactsRouter.delete("/:contactId", validateId, deleteContactById);

contactsRouter.patch(
  "/:contactId",
  validateId,
  validateUpdateContact,
  updateContactById
);

module.exports = contactsRouter;
