const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// import routes
const authRoute = require("./routes/api/auth");
const profileRoute = require("./routes/api/profile");
const postsRoute = require("./routes/api/posts");

// mongoose
const mongoose = require("mongoose");
const db = require("./config/keys").mongoDB;
const options = { useNewUrlParser: true };
mongoose
  .connect(
    db,
    options
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// use routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/posts", postsRoute);

app.get("/", (req, res) => res.send(`Hello`));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
