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
      omit: { authorId: true },
      include: {
        fields: {
          select: {
            field: {
              select: {
                name: true,
              },
            },
            value: true,
          },
        },
      },
    });

    type DataItem = {
      id: number;
      fields: {
        name: string;
        value: string;
      }[];
    };
    type NormalizedData = {
      [key: string]: DataItem;
    };

    const result = cards.reduce((acc, card) => {
      const fields = card.fields.map((field) => ({
        value: field.value,
        name: field.field.name,
      }));

      acc[card.id] = {
        id: card.id,
        fields: fields,
      };
      return acc;
    }, {} as NormalizedData);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
