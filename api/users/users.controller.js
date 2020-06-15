const usersModel = require("./users.model");
const bcrypt = require("bcryptjs");

class UsersController {
  constructor() {
    this._costFactor = 6;
  }

  get getUsers() {
    return this._getUsers.bind(this);
  }

  get getUserById() {
    return this._getUserById.bind(this);
  }

  get updateUserById() {
    return this._updateUserById.bind(this);
  }

  async _getUsers(req, res, next) {
    try {
      const { sub, page, limit } = req.query;
      let users;

      if (sub) {
        users = await usersModel.find({ subscription: sub });
      } else {
        users = await usersModel.find();
      }
      //mongoose-paginate
      if (page && limit) {
        const options = {
          page: page,
          limit: limit,
        };
        const paginated = await usersModel
          .paginate({}, options)
          .then((result) => result);
        return res.status(200).json(paginated);
      } else {
        return res.status(200).json(this.prepareUsersResponse(users));
      }
    } catch (err) {
      next(err);
    }
  }

  async _getUserById(req, res, next) {
    const id = req.params.id;

    try {
      const user = await usersModel.findById(id);
      if (!user) {
        res.status(404).json({ message: "Not found" });
      }

      const [userForResponse] = this.prepareUsersResponse([user]);

      res.status(200).json(userForResponse);
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      return res.status(200).json({
        email: req.user.email,
        subscription: req.user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteUserById(req, res, next) {
    try {
      const id = req.params.id;
      const deletedUser = await usersModel.findByIdAndDelete(id);
      if (!deletedUser) {
        throw res.status(404).json({ message: "Not found" });
      }
      res.status(200).json({ message: "user deleted" });
    } catch (err) {
      next(err);
    }
  }

  async _updateUserById(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "missing fields" });
      }
      //update by id or current user
      const id = req.params.id || req.user._id;

      const { password, ...userData } = req.body;

      if (password) {
        const passwordHash = await bcrypt.hash(password, this._costFactor);
        userData.password = passwordHash;
      }

      const updatedUser = await usersModel.findUserByIdAndUpdate(id, {
        ...userData,
      });

      if (!updatedUser) {
        res.status(404).json({ message: "Not found" });
      }

      const [userForResponse] = this.prepareUsersResponse([updatedUser]);

      res.status(200).json(userForResponse);
    } catch (err) {
      next(err);
    }
  }

  prepareUsersResponse(users) {
    return users.map((user) => {
      const { _id, subscription, email } = user;
      return { _id, subscription, email };
    });
  }
}

module.exports = new UsersController();
