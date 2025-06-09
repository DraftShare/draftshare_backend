import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { updateCardSchema } from "./types.js";
import gPrisma from "../../../prisma/prisma-client.js";

export async function update(req: Request, res: Response, next: NextFunction) {
  const prisma = gPrisma;

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
        include: {
          fields: {
            include: {
              field: true,
            },
          },
        },
      });
      if (!card) {
        throw new BadRequest(
          "Incorrect data was received: the card with the specified id was not found."
        );
      }

      const newFieldNames = data.fields.map((field) => field.name);
      const fieldsToDelete = card.fields.filter(
        (field) => !new Set(newFieldNames).has(field.field.name)
      );

      for (const field of fieldsToDelete) {
        await tx.cardField.delete({
          where: {
            cardId_fieldId: {
              cardId: data.id,
              fieldId: field.fieldId,
            },
          },
        });
      }

      for (const field of data.fields) {
        const resultField = await tx.field.upsert({
          where: {
            name_authorId: {
              name: field.name,
              authorId: user.id,
            },
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

        if (field.values && field.values.length > 0) { // MULTISELECT
          await tx.cardField.upsert({
            where: {
              cardId_fieldId: {
                cardId: data.id,
                fieldId: resultField.id,
              },
            },
            update: {
              value: "",
            },
            create: {
              cardId: data.id,
              fieldId: resultField.id,
              value: "",
            },
          });
          // Удаляем старые значения
          await tx.cardFieldValue.deleteMany({
            where: {
              cardId: data.id,
              fieldId: resultField.id,
            },
          });
          // Добавляем новые значения
          for (const value of field.values) {
            await tx.cardFieldValue.create({
              data: {
                cardId: data.id,
                fieldId: resultField.id,
                value,
              },
            });
          }
        } else { // остальные типы
          await tx.cardField.upsert({
            where: {
              cardId_fieldId: {
                cardId: data.id,
                fieldId: resultField.id,
              },
            },
            update: {
              value: field.value ?? "",
            },
            create: {
              cardId: data.id,
              fieldId: resultField.id,
              value: field.value ?? "",
            },
          });
        }
      }

      const cardWithFields = await tx.card.findUnique({
        where: { id: data.id },
        include: { fields: true },
      });

      if (cardWithFields && cardWithFields.fields.length === 0) {
        await tx.card.delete({
          where: { id: data.id },
        });
      }
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
