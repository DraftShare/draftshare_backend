import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { InternalServerError } from "../utils/errors.js";

export async function connectBD(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
    } else {
      throw new InternalServerError("No connection to the database");
    }
    next();
  } catch (error) {
    next(error);
  }
}
