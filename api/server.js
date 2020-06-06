const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const contactsRouter = require("./contacts/contacts.router");

(process.env.PORT && process.env.MONGODB_URL) || require("dotenv").config();

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: "http://localhost:" + process.env.PORT }));
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("\x1b[32m%s\x1b[0m", "Database connection successful");
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Server started listening on port:", process.env.PORT);
    });
  }
};
