import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { router } from "./routes/index.js";
import { authenticate } from "./middlewares/authentication.js";
import { log } from "./lib/log.js";
import {
  authMiddleware,
  defaultErrorMiddleware,
  showInitDataMiddleware,
} from "./controllers/authController.js";
import { userMiddleware } from "./middlewares/user.js";

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

app.use(authMiddleware);
// app.get('/api/words', showInitDataMiddleware);
app.use(userMiddleware);
app.use("/", router);
app.use(defaultErrorMiddleware);

// app.use("/api/word",authenticate);
// app.use("/auth/telegram", (req, res) => {
//   res.send("hi");
// });

// app.get('/auth', showInitDataMiddleware);
// app.use(defaultErrorMiddleware);

async function connectBD() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      log("Connected to MongoDB successfully");
    } else {
      throw Error;
    }
  } catch (error) {
    if (error instanceof Error) {
      log(`Error connecting to MongoDB: ${error.message}`);
      log(`Stack trace: ${error.stack}`);
    } else {
      log(`Unknown error occurred: ${String(error)}`);
    }

    process.exit(1);
  }
}
connectBD().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
