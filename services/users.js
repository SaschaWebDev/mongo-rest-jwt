const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const Users = require("../models/users.js");
const Posts = require("../models/posts.js");

module.exports = {
  findAll,
  findByUserId,
  createUser,
  updateUser,
  removeUser,
  findAllPosts,
  login,
};

async function findAll() {
  return await Users.find();
}

async function findByUserId(id) {
  return await Users.findById(id);
}

async function createUser(user_object, role = "user") {
  const salt = await bcrypt.genSalt();
  const user = new Users({
    firstname: user_object.firstname,
    lastname: user_object.lastname,
    email: user_object.email,
    password: bcrypt.hashSync(user_object.password, salt),
    role: role,
  });
  return await user.save();
}

// Liefert im Erfolgsfall den bearbeiteten User, ansonsten null zurück. Kein Passwort-Reset über diese Funktion.
async function updateUser(id, user_object) {
  let foundUser = await findByUserId(id);
  if (foundUser == null) {
    return null;
  }

  if (user_object.firstname != null) {
    foundUser.firstname = user_object.firstname;
  }
  if (user_object.lastname != null) {
    foundUser.lastname = user_object.lastname;
  }
  if (user_object.email != null) {
    foundUser.email = user_object.email;
  }
  return await foundUser.save();
}

async function removeUser(id) {
  return await Users.findByIdAndRemove(id);
}

async function findAllPosts(user_id) {
  return await Posts.find({ user_id: user_id }).exec();
}

async function login(email, password) {
  const user = await Users.findOne({ email: email });

  if (user) {
    const passwordMatching = bcrypt.compareSync(password, user.password);
    if (passwordMatching) {
      return [user, generateJWT(user)];
    }
  }
  return null;
}

// Hilfsmethode zur Erstellung eines Jsonwebtokens
function generateJWT(user) {
  const payload = {
    userid: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
  };

  const options = {
    expiresIn: "7d",
  };

  return jsonwebtoken.sign(payload, process.env.JWT_SECRET, options);
}
