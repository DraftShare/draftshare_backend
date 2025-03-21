import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { updateCardSchema } from "../../types/zod.js";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "./utils.js";

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
      const cards = await tx.card.findUnique({
        where: {
          id: data.id,
        },
      });
      if (!cards) {
        throw new BadRequest(
          "Incorrect data was received: the card with the specified id was not found."
        );
      }

      const existingFields = await tx.field.findMany({
        where: {
          author: user,
          cards: {
            some: {
              cardId: data.id,
            },
          },
        },
      });

      const existingFieldsIds = existingFields.map((item) => item.id);
      const incomingFieldsIds = new Set(
        data.fields.map((field) => field.id).filter((id) => id !== undefined)
      );

      const idsFieldsToDelete = [...existingFieldsIds].filter(
        (id) => !incomingFieldsIds.has(id)
      );

      await tx.cardField.deleteMany({
        where: {
          cardId: data.id,
          fieldId: { in: idsFieldsToDelete },
        },
      });

      let fieldsToUpdate: fieldWithId[] = [];
      let fieldsToCreate: fieldWithoutId[] = [];
      data.fields.forEach((field) => {
        if (field.id) {
          fieldsToUpdate.push({
            name: field.name,
            value: field.value,
            id: field.id,
          });
        } else fieldsToCreate.push(field);
      });

      for (const newField of fieldsToCreate) {
        await tx.field.create({
          data: {
            name: newField.name,
            author: {
              connect: {
                id: user.id,
              },
            },
            cards: {
              create: {
                cardId: data.id,
                value: newField.value,
              },
            },
          },
        });
      }

      for (const field of fieldsToUpdate) {
        await tx.cardField.update({
          where: {
            cardId_fieldId: {
              fieldId: field.id,
              cardId: data.id,
            },
          },
          data: {
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
