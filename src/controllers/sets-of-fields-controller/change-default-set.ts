import { NextFunction, Request, Response } from "express";
import gPrisma from "../../../prisma/prisma-client.js";
import { getUser } from "../utils.js";
import { setIdSchema } from "./types.js";
import { BadRequest } from "../../utils/errors.js";

export async function changeDefaultSet(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const prisma = gPrisma;
  const id = parseInt(req.params.id, 10);

  try {
    const user = await getUser(res);

    await prisma.$transaction(async (tx) => {
      const targetSet = await tx.setOfFields.findUnique({
        where: {
          authorId: user.id,
          id: id,
        },
      });
      if (!targetSet) {
        throw new BadRequest("setOfFields with the specified id was not found");
      }

      if (targetSet.defaultSet) {
        await tx.setOfFields.update({
          where: {
            id: targetSet.id,
          },
          data: {
            defaultSet: false,
          },
        });
      } else {
        const currentDefault = await tx.setOfFields.findFirst({
          where: {
            authorId: user.id,
            defaultSet: true,
          },
        });

        if (currentDefault) {
          await tx.setOfFields.update({
            where: { id: currentDefault.id },
            data: { defaultSet: false },
          });
        }

        await tx.setOfFields.update({
          where: { id: targetSet.id },
          data: { defaultSet: true },
        });
      }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
