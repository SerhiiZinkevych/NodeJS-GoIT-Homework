const mongoose = require("mongoose");
const { Schema } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: { type: String, required: false },
});

userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;

async function findUserByIdAndUpdate(userId, updateParams) {
  return await this.findByIdAndUpdate(
    userId,
    { $set: updateParams },
    { new: true }
  );
}

async function findUserByEmail(email) {
  return await userModel.findOne({ email });
}

async function updateToken(id, token) {
  return await this.findUserByIdAndUpdate(id, { token });
}

userSchema.plugin(mongoosePaginate);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
