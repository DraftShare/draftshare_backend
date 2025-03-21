import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { updateCardSchema } from "../../types/zod.js";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";

export async function update(req: Request, res: Response, next: NextFunction) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = updateCardSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const data = incoming.data;

    await prisma.$transaction(async (tx) => {
      const card = await tx.card.findUnique({
        where: {
          id: data.id,
        },
      });
      if (!card) {
        throw new BadRequest(
          "Incorrect data was received: the card with the specified id was not found."
        );
      }

      for (const field of data.fieldsToDelete) {
        await tx.cardField.delete({
          where: {
            cardId_authorId_name: {
              cardId: data.id,
              authorId: user.id,
              name: field.name,
            },
          },
        });
      }

      for (const newField of data.fieldsToUpsert) {
        await tx.field.upsert({
          where: {
            authorId_name: {
              authorId: user.id,
              name: newField.name,
            },
          },
          update: {},
          create: {
            name: newField.name,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        await tx.cardField.upsert({
          where: {
            cardId_authorId_name: {
              cardId: data.id,
              authorId: user.id,
              name: newField.name,
            },
          },
          update: {
            value: newField.value,
          },
          create: {
            cardId: data.id,
            authorId: user.id,
            name: newField.name,
            value: newField.value,
          },
        });
      }
    });
    res.status(200).json("ok");
  } catch (error) {
    next(error);
  }
}
