import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { upsertAndDeleteSchema } from "./types.js";

export async function upsertAndDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = upsertAndDeleteSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const { fieldsToDelete, fieldsToUpsert } = incoming.data;

    const hasDuplicates =
      new Set(fieldsToUpsert.map((item) => item.name)).size !==
      fieldsToUpsert.length;

    if (hasDuplicates) {
      throw new BadRequest("Incorrect data was received: the name field must be unique.");
    }

    await prisma.$transaction(async (tx) => {
      for (const fieldId of fieldsToDelete) {
        await tx.field.delete({
          where: {
            id: fieldId,
          },
        });
      }

      for (const field of fieldsToUpsert) {
        if (field.id) {
          await tx.field.update({
            where: { id: field.id },
            data: {
              name: field.name,
              author: { connect: { id: user.id } },
            },
          });
        } else {
          await tx.field.create({
            data: {
              name: field.name,
              author: { connect: { id: user.id } },
            },
          });
        }
      }
    });
    const fields = await prisma.field.findMany({
      where: {
        author: user,
      },
      omit: { authorId: true },
    });

    res.status(200).json(fields);
  } catch (error) {
    next(error);
  }
}
