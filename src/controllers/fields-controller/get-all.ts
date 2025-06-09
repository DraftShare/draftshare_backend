import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getUser } from "../utils.js";
import gPrisma from "../../../prisma/prisma-client.js";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  const prisma = gPrisma;

  try {
    const user = await getUser(res);

    const fields = await prisma.field.findMany({
      where: {
        author: user,
      },
    });

    res.json(fields);
  } catch (error) {
    next(error);
  }
}
