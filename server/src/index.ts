import express from "express";
import cors from "cors";
import { json, urlencoded } from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import errorHandler from "./middleware/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});