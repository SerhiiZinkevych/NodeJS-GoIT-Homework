const AvatarGenerator = require("avatar-generator");
const path = require("path");
const fs = require("fs");
const { promises: fsPromises } = fs;
const userModel = require("../../users/users.model");

async function deleteAvatarFile(avatarURL) {
  fsPromises.unlink(path.join(__dirname, "../../../public", avatarURL));
}

async function generateAvatar(req) {
  const { email, gender } = req.body;
  const avatar = new AvatarGenerator({
    parts: ["background", "face", "clothes", "head", "hair", "eye", "mouth"], //order in which sprites should be combined
    partsLocation: path.join(__dirname, "./avatar_sprites"), // path to sprites
    imageExtension: ".png", // sprite file extension
  });

  const currUser = await userModel.findUserByEmail(email);
  if (currUser) {
    deleteAvatarFile(currUser.avatarURL);
  }

  const variant = gender;
  const image = await avatar.generate(email, variant);

  const fileName = email.split("@")[0] + `_${Date.now()}.png`; //login from email + current date in ms
  const srcPath = "tmp/" + fileName;
  const destPath = "public/images/" + fileName;

  await image.png().toFile(`tmp/${fileName}`);

  await fsPromises.copyFile(srcPath, destPath);
  await fsPromises.unlink(srcPath);

  return `images/${fileName}`;
}

module.exports.generateAvatar = generateAvatar;
module.exports.deleteAvatarFile = deleteAvatarFile;
