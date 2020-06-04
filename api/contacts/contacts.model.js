const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  password: { type: String, required: true },
  token: { type: String },
});

contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;

async function findContactByIdAndUpdate(contactId, updateParams) {
  return await this.findByIdAndUpdate(
    contactId,
    { $set: updateParams },
    { new: true }
  );
}

const contactModel = mongoose.model("Contact", contactSchema);

module.exports = contactModel;
