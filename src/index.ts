import express from "express";
import { router } from "./api/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.get("/", (req, res) => {
  return res.status(200).send({
    message: "Hello World",
  });
});

app.listen(4000, () => {
  console.log("API is running on localhost:4000");
});
