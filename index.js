const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} = require("./contacts");

const argv = require("yargs").argv;

function displayResponse(response, successMessage, errorMessage) {
  if (response) {
    console.log(`\x1b[32m ${successMessage} \x1b[0m`);
    console.table(response);
  } else {
    console.warn(`\x1B[31m ${errorMessage} \x1b[0m`);
  }
}

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      listContacts().then(console.table);
      break;

    case "get":
      getContactById(id).then((response) =>
        displayResponse(
          response,
          `⬇ Contact with id:${id} ⬇`,
          `Contact with id ${id} was not found.`
        )
      );
      break;

    case "add":
      if (name === "" || phone === "") {
        console.error("\x1B[31m Name and phone fields can't be empty! \x1b[0m");
        return;
      }
      addContact(name, email, phone).then((response) =>
        displayResponse(
          response,
          "Contact added successfully.",
          "Error while adding new contact."
        )
      );
      break;

    case "remove":
      removeContact(id).then((response) =>
        displayResponse(
          response,
          "Contact deleted successfully.",
          `Contact with id:${id} was not found!`
        )
      );
      break;

    default:
      console.warn("\x1B[31m Unknown action type! \x1b[0m");
  }
}
invokeAction(argv);
