import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { BadRequest, NotFound } from "../utils/errors.js";
import { getInitData } from "./authController.js";

export async function getUser(res: Response) {
  const prisma = new PrismaClient();

  const tgId = String(getInitData(res)?.user?.id);
  if (!tgId) {
    throw new BadRequest("User ID (tgId) is missing");
  }

  const user = await prisma.user.findUnique({
    where: {
      tgId: tgId,
    },
  });
  if (!user) {
    throw new NotFound("User not found");
  }
  return user;
}
