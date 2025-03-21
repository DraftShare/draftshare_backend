import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { getUser } from "./utils.js";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);

    const cards = await prisma.card.findMany({
      where: {
        author: user,
      },
      omit: { authorId: true },
      include: {
        fields: {
          omit: {
            cardId: true,
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
      acc[card.id] = {
        id: card.id,
        fields: card.fields,
      };
      return acc;
    }, {} as NormalizedData);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
