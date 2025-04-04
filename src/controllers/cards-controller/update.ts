import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { updateCardSchema } from "./types.js";

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
            cardId_fieldId: {
              cardId: data.id,
              fieldId: field.id,
            },
          },
        });
      }

      for (const field of data.fieldsToUpsert) {
        await tx.field.upsert({
          where: {
            id: field.id,
          },
          update: {},
          create: {
            name: field.name,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        await tx.cardField.upsert({
          where: {
            cardId_fieldId: {
              cardId: data.id,
              fieldId: field.id,
            },
          },
          update: {
            value: field.value,
          },
          create: {
            cardId: data.id,
            fieldId: field.id,
            value: field.value,
          },
        });
      }
    });
    res.status(200).json("ok");
  } catch (error) {
    next(error);
  }
}
