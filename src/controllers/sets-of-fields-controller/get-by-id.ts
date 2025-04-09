import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { getUser } from "../utils.js";
import gPrisma from "../../../prisma/prisma-client.js"

export async function getById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const prisma = gPrisma;
  const setId = parseInt(req.params.id, 10);

  if (isNaN(setId)) {
    res.status(400).json({ message: "Invalid ID format" });
    return;
  }

  try {
    const user = await getUser(res);

    const set = await prisma.setOfFields.findUnique({
      where: {
        id: setId,
        authorId: user.id,
      },
      omit: { authorId: true },
      include: {
        fields: true,
      },
    });

    if (!set) {
      res.status(404).json({ message: "Set not found" });
      return;
    }

    res.json(set);
  } catch (error) {
    next(error);
  }
}
