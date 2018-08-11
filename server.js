const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

//mongoose
const mongoose = require("mongoose");
const db = require("./config/keys").mongoDB;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get("/:name?", (req, res) =>
  res.send(`Hi ${req.params.name ? req.params.name : ""}`)
);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
