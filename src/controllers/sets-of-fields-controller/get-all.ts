import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getUser } from "../utils.js";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);

    const sets = await prisma.setOfFields.findMany({
      where: {
        author: user,
      },
      omit: { authorId: true },
      include: {
        fields: true,
      },
    });

    res.json(sets);
  } catch (error) {
    next(error);
  }
}
