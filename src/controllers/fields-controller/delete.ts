import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { deleteFieldsSchema } from "./types.js";
import gPrisma from "../../../prisma/prisma-client.js"

export async function deleteMany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const prisma = gPrisma;

  try {
    const user = await getUser(res);
    const incoming = deleteFieldsSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const ids = incoming.data.ids;

    await prisma.field.deleteMany({
      where: {
        id: { in: ids },
        author: user,
      },
    });

    res.status(204).json("");
  } catch (error) {
    next(error);
  }
}
