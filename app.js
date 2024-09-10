require("dotenv").config(); //import the dotenv and config it

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const authRouter = require("./routes/authRouter"); // imports route to app.js from authrouter in route folder

const movieRouter = require("./routes/movieRouter");

const bookmarkRouter = require("./routes/bookmarkRouter");

const error = require("./middlewares/error");

const app = express(); //spins up a new express application

const port = 4000;

app.use(cors());

app.use(express.json()); // a middleware that allows access to the req.body on all request (without this you cant test on postman)

app.use("/api/auth", authRouter); //middleware for login and register for authentication router

app.use("/api/movie", movieRouter);

app.use("/api/bookmark", bookmarkRouter);

app.use(error); // custom middleware for errors

/// START LISTEN ON A GIVEN PORT AND RUN THE CALLBACK FUNCTION
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DataBase Connection Sucess");

    await app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Unable to Connect");
  }
};
start();

//joshuamayberry66
//YildI7Osg7kFZXua
//mongodb+srv://joshuamayberry66:YildI7Osg7kFZXua@cluster0.y2dzn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
