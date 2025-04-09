import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { upsertDataSchema } from "./types.js";
import { text } from "stream/consumers";
import gPrisma from "../../../prisma/prisma-client.js"

export async function upsert(req: Request, res: Response, next: NextFunction) {
  const prisma = gPrisma;

  try {
    const user = await getUser(res);
    const incoming = upsertDataSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const { id, name: setName, fields } = incoming.data;
    let setId = id;

    await prisma.$transaction(async (tx) => {
      if (id) {
        const existingSet = await tx.setOfFields.findUnique({
          where: {
            id: id,
          },
        });
        if (!existingSet) {
          throw new BadRequest(
            "Incorrect data was received: the set with the specified id was not found"
          );
        }

        await upsertFieldsForSet(tx, user.id, fields, id);
      } else {
        const newSet = await tx.setOfFields.create({
          data: {
            authorId: user.id,
            name: setName,
          },
        });

        await upsertFieldsForSet(tx, user.id, fields, newSet.id);
        setId = newSet.id;
      }
    });

    const set = await prisma.setOfFields.findUnique({
      where: {
        id: setId,
      },
      include: {
        fields: true,
      },
    });

    res.status(200).json(set);
  } catch (error) {
    next(error);
  }
}

async function upsertFieldsForSet(
  tx: Prisma.TransactionClient,
  userId: number,
  fields: string[],
  setId: number
) {
  const currentSet = await tx.setOfFields.findUnique({
    where: { id: setId },
    include: { fields: true },
  });

  if (!currentSet) {
    throw new Error("Set not found");
  }

  const currentFieldNames = currentSet.fields.map((f) => f.name);
  const newFieldNames = fields;

  const fieldsToRemove = currentFieldNames.filter(
    (name) => !newFieldNames.includes(name)
  );

  const fieldsToAdd = newFieldNames.filter(
    (name) => !currentFieldNames.includes(name)
  );

  for (const fieldName of fieldsToRemove) {
    await tx.setOfFields.update({
      where: { id: setId },
      data: {
        fields: {
          disconnect: {
            name_authorId: {
              name: fieldName,
              authorId: userId,
            },
          },
        },
      },
    });
  }

  for (const fieldName of fieldsToAdd) {
    await tx.field.upsert({
      where: {
        name_authorId: {
          name: fieldName,
          authorId: userId,
        },
      },
      update: {
        setsOfFields: {
          connect: {
            id: setId,
          },
        },
      },
      create: {
        name: fieldName,
        authorId: userId,
        setsOfFields: {
          connect: {
            id: setId,
          },
        },
      },
    });
  }
}
