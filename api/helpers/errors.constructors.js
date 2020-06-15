module.exports.UnauthorizedError = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
    if (process.env.NODE_ENV === "production") {
      delete this.stack;
    }
  }
};
