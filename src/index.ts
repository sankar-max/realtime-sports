import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
