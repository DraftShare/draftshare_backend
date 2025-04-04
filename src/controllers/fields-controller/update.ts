import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BadRequest } from "../../utils/errors.js";
import { getUser } from "../utils.js";
import { deleteFieldsSchema, updateFieldsSchema } from "./types.js";

export async function update(req: Request, res: Response, next: NextFunction) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = updateFieldsSchema.safeParse(req.body);
    if (!incoming.success) {
      throw new BadRequest("Incorrect data was received");
    }
    const fields = incoming.data;

    for (let field of fields) {
      await prisma.field.update({
        where: {
          id: field.id,
        },
        data: {
          name: field.name,
        },
      });
    }

    res.status(200).json("");
  } catch (error) {
    next(error);
  }
}
