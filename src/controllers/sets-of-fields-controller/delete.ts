import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { deleteIdsSchema } from "./types.js";

export async function deleteMany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = deleteIdsSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const ids = incoming.data;

    await prisma.setOfFields.deleteMany({
      where: {
        id: { in: ids },
        author: user,
      },
    });

    

    res.status(204).send()
  } catch (error) {
    next(error);
  }
}
