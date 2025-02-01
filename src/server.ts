import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { router } from "./routes/index.js";
import { authenticate } from "./middlewares/authentication.js";
import { authMiddleware } from "./controllers/authController.js";
import { userMiddleware } from "./middlewares/user.js";
import { handleErrors } from "./middleware/handleErrors.js";
import { InternalServerError } from "./utils/errors.js";
import { connectBD } from "./middlewares/connectBD.js";

const app = express();
const port = 7829;

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://172.29.64.119:3000",
    "https://flying-squirrel.duckdns.org",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(connectBD);

app.use(authMiddleware);
app.use(userMiddleware);
app.use("/", router);

//@ts-ignore
app.use(handleErrors);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
