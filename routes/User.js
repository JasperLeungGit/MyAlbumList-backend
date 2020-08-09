const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const Album = require("../models/Album");

const signToken = (userID) => {
  return JWT.sign({ iss: "Client", sub: userID }, "Client", {
    expiresIn: "1h",
  });
};

userRouter.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) {
      res
        .status(500)
        .json({ message: { msgBody: "Error has occured", msgError: true } });
    }
    if (user) {
      res.status(400).json({
        message: { msgBody: "Username is already taken", msgError: true },
      });
    } else {
      const newUser = new User({ username, password, role });
      newUser.save((err) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        else
          res.status(201).json({
            message: {
              msgBody:
                "Account successfully created. You will now be redirected to the login.",
              msgError: false,
            },
          });
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res.status(200).json({ isAuthenticated: true, user: { username, role } });
    }
  }
);

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

userRouter.post(
  "/album",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const album = new Album(req.body);
    album.save((err) => {
      if (err)
        res
          .status(500)
          .json({ message: { msgBody: "Error has occured", msgError: true } });
      else {
        req.user.albums.push(album);
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: { msgBody: "Error has occured", msgError: true },
            });
          else
            res.status(200).json({
              message: {
                msgBody: "Successfully added album,",
                msgError: false,
              },
            });
        });
      }
    });
  }
);

userRouter.post(
  "/album/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.body.id;
    Album.findByIdAndDelete(id, function (err, docs) {
      if (err) {
        res.status(500).json({
          message: { msgBody: "Error has occured", msgError: true },
        });
      } else {
        res.status(200).json({
          message: { msgBody: "Deleted", msgError: false },
        });
      }
    });
  }
);

userRouter.get(
  "/albums",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById({ _id: req.user._id })
      .populate("albums")
      .exec((err, document) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Error has occured", msgError: true },
          });
        else {
          res
            .status(200)
            .json({ albums: document.albums, authenticated: true });
        }
      });
  }
);

userRouter.get("/userlist", (req, res) => {
  User.find({}, function (err, users) {
    if (!err) {
      var usernames = [];
      users.forEach(function (user) {
        const { username } = user;
        usernames.push(username);
      });
      res.send(usernames);
    } else {
      res.status(400).json("Error: " + err);
    }
  });
});

userRouter.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "admin") {
      res
        .status(200)
        .json({ message: { msgBody: "You are an admin", msgError: false } });
    } else
      res.status(403).json({
        message: { msgBody: "You're not an admin,go away", msgError: true },
      });
  }
);

userRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { username, role } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, role } });
  }
);

module.exports = userRouter;
