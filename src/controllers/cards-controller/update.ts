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
      // Verify the card exists and belongs to the user
      const card = await tx.card.findUnique({
        where: {
          id: data.id,
          authorId: user.id,
        },
        include: {
          fields: {
            include: {
              field: true,
              values: true,
            },
          },
        },
      });

      if (!card) {
        throw new BadRequest(
          "Incorrect data was received: the card with the specified id was not found."
        );
      }

      // Get field names from incoming data
      const newFieldNames = data.fields.map((field) => field.name);

      // Find fields that exist in DB but not in incoming data (to be deleted)
      const fieldsToDelete = card.fields.filter(
        (field) => !newFieldNames.includes(field.field.name)
      );

      // Delete fields that are no longer present
      for (const field of fieldsToDelete) {
        // First delete CardFieldValues if they exist
        await tx.cardFieldValue.deleteMany({
          where: {
            cardId: data.id,
            fieldId: field.fieldId,
          },
        });

        // Then delete the CardField
        await tx.cardField.delete({
          where: {
            cardId_fieldId: {
              cardId: data.id,
              fieldId: field.fieldId,
            },
          },
        });
      }

      // Process each field from incoming data
      for (const fieldData of data.fields) {
        // Upsert the Field definition
        const resultField = await tx.field.upsert({
          where: {
            name_authorId: {
              name: fieldData.name,
              authorId: user.id,
            },
          },
          update: {
            type: fieldData.type,
            options: fieldData.options || [],
          },
          create: {
            name: fieldData.name,
            type: fieldData.type,
            options: fieldData.options || [],
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        // Handle MULTISELECT fields differently
        if (fieldData.type === "MULTISELECT") {
          // First upsert the CardField (with empty value for MULTISELECT)
          await tx.cardField.upsert({
            where: {
              cardId_fieldId: {
                cardId: data.id,
                fieldId: resultField.id,
              },
            },
            update: {
              value: "", // MULTISELECT uses values array, not this field
            },
            create: {
              cardId: data.id,
              fieldId: resultField.id,
              value: "", // MULTISELECT uses values array, not this field
            },
          });

          // Delete existing values that aren't in the new data
          await tx.cardFieldValue.deleteMany({
            where: {
              cardId: data.id,
              fieldId: resultField.id,
              NOT: {
                value: {
                  in: fieldData.value || [],
                },
              },
            },
          });

          // Add new values that don't already exist
          const existingValues = (
            await tx.cardFieldValue.findMany({
              where: {
                cardId: data.id,
                fieldId: resultField.id,
              },
              select: {
                value: true,
              },
            })
          ).map((v) => v.value);

          const valuesToAdd = (fieldData.value || []).filter(
            (v) => !existingValues.includes(v)
          );

          for (const value of valuesToAdd) {
            await tx.cardFieldValue.create({
              data: {
                cardId: data.id,
                fieldId: resultField.id,
                value,
              },
            });
          }
        } else {
          // Handle other field types (INPUT, TEXTAREA, SELECT)
          await tx.cardField.upsert({
            where: {
              cardId_fieldId: {
                cardId: data.id,
                fieldId: resultField.id,
              },
            },
            update: {
              value: fieldData.value?.[0] ?? "", // For non-MULTISELECT, use first value or empty string
            },
            create: {
              cardId: data.id,
              fieldId: resultField.id,
              value: fieldData.value?.[0] ?? "", // For non-MULTISELECT, use first value or empty string
            },
          });

          // Clear any existing CardFieldValues for this field (in case type was changed from MULTISELECT)
          await tx.cardFieldValue.deleteMany({
            where: {
              cardId: data.id,
              fieldId: resultField.id,
            },
          });
        }
      }

      // Check if card has any fields left and delete if empty
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
