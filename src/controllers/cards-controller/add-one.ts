import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { addCardSchema } from "./types.js";

export async function addOne(req: Request, res: Response, next: NextFunction) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = addCardSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const data = incoming.data;

    await prisma.$transaction(async (tx) => {
      const card = await tx.card.create({
        data: {
          author: {
            connect: { id: user.id },
          },
        },
      });

      for (const field of data.fields) {
        await tx.field.upsert({
          where: {
            id: field.id,
          },
          update: {
            name: field.name,
          },
          create: {
            name: field.name,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        await tx.cardField.create({
          data: {
            value: field.value,
            cardId: card.id,
            fieldId: field.id,
          },
        });
      }
    });

    res.status(201).json("ok");
  } catch (error) {
    next(error);
  }
}
