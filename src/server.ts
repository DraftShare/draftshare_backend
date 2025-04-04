import cors from "cors";
import "dotenv/config";
import express from "express";
import { authMiddleware } from "./controllers/authController.js";
import { handleErrors } from "./middlewares/handleErrors.js";
import { userMiddleware } from "./middlewares/user.js";
import { router } from "./routes/index.js";

const app = express();
const port = process.env.PORT || 7829;

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
app.options(/(.*)/, cors(corsOptions));

app.use(authMiddleware);
app.use(userMiddleware);
app.use("/", router);

//@ts-ignore
app.use(handleErrors);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
