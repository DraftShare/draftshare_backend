import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { addCardSchema } from "../../types/zod.js";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "./utils.js";

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
        const newField = await tx.field.upsert({
          where: {
            authorId_name: {
              name: field.name,
              authorId: user.id,
            },
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
            name: newField.name,
            value: field.value,
            cardId: card.id,
            authorId: user.id,
          },
        });
      }
    });

    res.status(201).json("ok");
  } catch (error) {
    next(error);
  }
}
