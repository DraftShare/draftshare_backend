import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { router } from "./routes/index.js";
import { authenticate } from "./middlewares/authentication.js";
import "dotenv/config";
import { log } from "./lib/log.js";

const app = express();
const port = 7829;

app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://flying-squirrel.duckdns.org"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

log("Server started");

// Логирование входящих запросов
app.use((req, res, next) => {
  log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Логирование ошибок
process.on("uncaughtException", (err) => {
  log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  log(`Unhandled Rejection: ${reason}`);
});

// app.use("/api/word",authenticate);
app.use("/", router);

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
