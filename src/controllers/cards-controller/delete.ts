import express, { NextFunction, Request, Response } from "express";
import { getUser } from "./utils.js";
import { deleteCardsSchema } from "../../types/zod.js";
import { BadRequest } from "../../utils/errors.js";
import { PrismaClient } from "@prisma/client";

export async function deleteMany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = deleteCardsSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const ids = incoming.data.ids;

    const deleteCards = await prisma.card.deleteMany({
      where: {
        id: { in: ids },
        author: user,
      },
    });

    res.status(204).json('');
  } catch (error) {
    next(error);
  }
}
