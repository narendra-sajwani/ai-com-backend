const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes.js");
const chatRouter = require("./routes/userChats.js");
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hey there!");
  console.log("at:", req.url);
});

//user routes
app.use("/user", userRouter);
app.use("/chat", chatRouter);

app.listen(port, () => {
  console.log("server lsitening at port:", port);
});
