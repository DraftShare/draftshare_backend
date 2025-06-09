import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { addCardSchema } from "./types.js";
import gPrisma from "../../../prisma/prisma-client.js";

export async function addOne(req: Request, res: Response, next: NextFunction) {
  const prisma = gPrisma;

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
        let optionsToSave: string[] = [];
        if (field.type === "SELECT" || field.type === "MULTISELECT") {
          if (
            !field.options ||
            !Array.isArray(field.options) ||
            field.options.length === 0
          ) {
            throw new BadRequest(
              "Options are required for SELECT and MULTISELECT fields"
            );
          }
          optionsToSave = field.options;
        }
        const resultField = await tx.field.upsert({
          where: {
            name_authorId: {
              name: field.name,
              authorId: user.id,
            },
          },
          update: {
            name: field.name,
            type: field.type,
            options: optionsToSave,
          },
          create: {
            name: field.name,
            type: field.type,
            options: optionsToSave,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        if (field.type === "MULTISELECT") {
          const cardField = await tx.cardField.create({
            data: {
              cardId: card.id,
              fieldId: resultField.id,
              value: "",
            },
          });
          for (const value of field.value) {
            await tx.cardFieldValue.create({
              data: {
                cardId: card.id,
                fieldId: resultField.id,
                value,
              },
            });
          }
        } else {
          await tx.cardField.create({
            data: {
              value: field.value[0],
              cardId: card.id,
              fieldId: resultField.id,
            },
          });
        }
      }
    });

    res.status(201).send();
  } catch (error) {
    next(error);
  }
}
