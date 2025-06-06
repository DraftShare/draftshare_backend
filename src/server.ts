import cors from "cors";
import "dotenv/config";
import express from "express";
import { authMiddleware } from "./controllers/authController.js";
import { handleErrors } from "./middlewares/handleErrors.js";
import { userMiddleware } from "./middlewares/user.js";
import { router } from "./routes/index.js";

const app = express();
const port = process.env.NODE_DOCKER_PORT;

app.use(express.json());

let origin = undefined;
if (process.env.NODE_ENV === "development" && process.env.CORS_ORIGIN_DEV) {
  origin = [process.env.CORS_ORIGIN_DEV];
} else if (
  process.env.NODE_ENV === "production" &&
  process.env.CORS_ORIGIN_PROD
) {
  origin = [process.env.CORS_ORIGIN_PROD];
}

const corsOptions = {
  origin: origin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

app.use(authMiddleware);
app.use(userMiddleware);
app.use("/", router);

//@ts-ignore
app.use(handleErrors);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
