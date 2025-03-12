import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { InternalServerError } from "../utils/errors.js";

export async function connectBD(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!process.env.MONGO_URI_DEVELOP || !process.env.MONGO_URI_PROD) {
      throw new InternalServerError("No connection to the database");
    }

    const mongoUri =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI_PROD
        : process.env.NODE_ENV === "development"
        ? process.env.MONGO_URI_DEVELOP
        : "";

    await mongoose.connect(mongoUri);

    next();
  } catch (error) {
    next(error);
  }
}
