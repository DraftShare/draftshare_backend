import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { deleteFieldsSchema } from "./types.js";

export async function deleteMany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = deleteFieldsSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const names = incoming.data.names;

    await prisma.field.deleteMany({
      where: {
        name: { in: names },
        author: user,
      },
    });

    res.status(204).json("");
  } catch (error) {
    next(error);
  }
}
