const express = require("express");
const userRouter = require("./routers/userRouter");
const app = express();
const connectDb = require("./config/db");

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

//connect db
connectDb();

app.get("/", (req, res) => res.send("dfjasjdfkjd"));

app.use("/api", userRouter);

app.use((err, req, res, next) => {
  if (err) {
    return res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log("Server is runnning on http://localhost:5000");
});
