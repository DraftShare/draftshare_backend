import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getUser } from "../utils.js";
import gPrisma from "../../../prisma/prisma-client.js"

export async function getAll(req: Request, res: Response, next: NextFunction) {
  const prisma = gPrisma;
  try {
    const user = await getUser(res);

    const cards = await prisma.card.findMany({
      where: {
        author: user,
      },
      include: {
        fields: {
          select: {
            value: true,
            values: true,
            field: {
              select: {
                id: true,
                name: true,
                type: true,
                options: true,
              },
            },
          },
        },
      },
    });

    const result = cards.reduce((acc, card) => {
      const fields = card.fields.map((field) => ({
        id: field.field.id,
        name: field.field.name,
        type: field.field.type,
        options: field.field.options && field.field.options.length > 0 ? field.field.options : undefined,
        value: field.field.type === "MULTISELECT" ? field.values.map((v) => v.value) : [field.value],
        // values: field.values.map((v) => v.value),
      }));
      acc[String(card.id)] = {
        id: card.id,
        fields,
      };
      return acc;
    }, {} as Record<string, any>);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
