const express = require("express");
const router = express.Router();

const userServices = require("../services/users.js");
const { authorizeUser } = require("../middlewares/auth.js");
const { authorizeAdmin } = require("../middlewares/authAdmin.js");

// GET Alle Users durch Admin
router.get("/", authorizeAdmin, async (req, res) => {
  try {
    const users = await userServices.findAll();
    res.status(200).json({ users: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET User anhand von User ID durch User
router.get("/:id", authorizeUser, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const user = await userServices.findByUserId(id);
    user
      ? res.status(200).json({
          user: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
          },
        })
      : res.status(404).json({ message: `User ${id} wurde nicht gefunden.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Usererstellung durch Admin
router.post("/add", authorizeAdmin, async (req, res) => {
  try {
    const newUser = await userServices.createUser(req.body, "user");
    res.status(201).json({
      user: {
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST User Registrierung mittels Emailverifikation TODO(mailgun, Datenschutz)

// POST User bearbeiten durch User
router.post("/update/:id", authorizeUser, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    let updatedUser = await userServices.updateUser(id, req.body);
    if (updatedUser == null) {
      res.status(404).json({ message: `User ${id} wurde nicht gefunden.` });
    }
    res.status(200).json({
      updatedUser: {
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE User löschen durch Admin
router.delete("/:id", authorizeAdmin, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const removedUser = await userServices.removeUser(id);
    removedUser
      ? res.status(200).json({ deleted: removedUser })
      : res.status(404).json({ message: `User ${id} wurde nicht gefunden.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET Alle Posts eines Users
router.get("/posts/:id", authorizeUser, async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const posts = await userServices.findAllPosts(id);
    res.status(200).json({ posts: posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST User Login
router.post("/login", async (req, res) => {
  try {
    const loggedInUser = await userServices.login(
      req.body.email,
      req.body.password
    );
    if (loggedInUser) {
      res.status(200).json({
        user: {
          firstname: loggedInUser[0].firstname,
          lastname: loggedInUser[0].lastname,
          email: loggedInUser[0].email,
          role: loggedInUser[0].role,
        },
        token: loggedInUser[1],
      });
    } else {
      res.status(404).json({ message: "Login fehlgeschlagen." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
