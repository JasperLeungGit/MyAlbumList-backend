const express = require("express");
const listRouter = express.Router();
const User = require("../models/user");

listRouter.get("/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .populate("albums")
    .exec((err, document) => {
      if (err)
        res.status(500).json({
          message: { msgBody: "Error has occured", msgError: true },
        });
      else {
        res.status(200).json({ albums: document.albums });
      }
    });
});

module.exports = listRouter;
