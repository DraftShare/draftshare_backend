import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { router } from "./routes/index.js";
import { authenticate } from "./middlewares/authentication.js";
import 'dotenv/config'

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
// app.use("/api/word",authenticate);
app.use("/", router);

async function connectBD() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
}

connectBD().catch((err) => console.log(err));

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
