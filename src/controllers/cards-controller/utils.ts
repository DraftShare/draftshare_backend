import { User } from "../../model/schemas.js";
import { BadRequest, NotFound } from "../../utils/errors.js";
import { getInitData } from "../authController.js";
import express, { NextFunction, Request, Response } from "express";




export async function getUser(res: Response) {
  const tgId = getInitData(res)?.user?.id;
  if (!tgId) {
    throw new BadRequest("User ID (tgId) is missing");
  }

  const user = await User.findOne({ tgId }).exec();
  if (!user) {
    throw new NotFound("User not found");
  }
  return user;
}

export function clearingReqBody(req: Request) {
  const { _id, author, ...rest } = req.body;
  return rest;
}