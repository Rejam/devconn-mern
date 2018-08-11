const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const PORT = process.env.PORT || 5000;

const app = express();
// app middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

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

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
