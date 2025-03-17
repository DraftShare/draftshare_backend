import express, { NextFunction, Request, Response } from "express";
import { getUser } from "./utils.js";
import { PrismaClient } from "@prisma/client";

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
            fieldId: true,
          },
          include: {
            field: {
              omit: {
                authorId: true,
              },
            },
          },
        },
      },
    });

    type DataItem = {
      id: number;
      fields: {
        id: number;
        name: string;
        value: string;
      }[];
    };
    type NormalizedData = {
      [key: string]: DataItem;
    };

    const result = cards.reduce((acc, card) => {
      const fields = card.fields.map((field) => {
        return {
          id: field.field.id,
          name: field.field.name,
          value: field.value,
        };
      });
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
