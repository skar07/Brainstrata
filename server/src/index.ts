import express from "express";
import cors from "cors";
import { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import contextRoutes from "./routes/context";
import errorHandler from "./middleware/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World! This API uses OAuth 2.0 for authentication. Please login via your OAuth2.0 provider.");
});

// Registration and logout are still handled here, but login is via OAuth2.0 provider
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/context", contextRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});