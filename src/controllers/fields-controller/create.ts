import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { addFieldsSchema } from "./types.js";
import gPrisma from "../../../prisma/prisma-client.js"

export async function create(req: Request, res: Response, next: NextFunction) {
  const prisma = gPrisma;

  try {
    const user = await getUser(res);
    const incoming = addFieldsSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const data = incoming.data.fields.map(({ name }) => ({
      name,
      authorId: user.id,
    }));

    await prisma.field.createMany({
      data: data,
    });

    res.status(201).json("ok");
  } catch (error) {
    next(error);
  }
}
