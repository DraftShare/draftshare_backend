import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getUser } from "../utils.js";
import { addFieldSchema } from "./types.js";
import { BadRequest } from "../../utils/errors.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = addFieldSchema.safeParse(req.body);
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
