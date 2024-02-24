const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
// mongoose.connect('mongodb+srv://1999rkgupta:alla0210379@cluster0.3mwizsk.mongodb.net/chatApp?retryWrites=true&w=majority',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })

app.use(cors({
    origin: ['https://chat-app-frontend-ashen.vercel.app/'], // Exact match
    methods: ["GET", "POST"], // Adjust methods as needed
    credentials: true, // If sending/receiving cookies or auth tokens
}));


app.use("/api/v1", userRoute);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/messages", messageRoute);

app.get("/", (req, res) => {
  res.send("Welcome to chat app API");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, res) => {
  console.log(`server running on port... : ${port}`);
});

mongoose
  .connect("mongodb+srv://1999rkgupta:alla0210379@cluster0.3mwizsk.mongodb.net/chatApp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB database connection established successfully");
  })
  .catch(err => {
    console.log("mondoDb connection failed", err.message);
  });
