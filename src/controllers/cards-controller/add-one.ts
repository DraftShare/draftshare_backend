import express, { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { clearingReqBody, getUser } from "./utils.js";
import { addCardSchema } from "../../types/zod.js";
import { BadRequest, InternalServerError } from "../../utils/errors.js";
import { Card, CardProperty, Property } from "../../model/schemas.js";
import { Prisma, PrismaClient } from "@prisma/client";

export async function addOne(req: Request, res: Response, next: NextFunction) {
  const prisma = new PrismaClient();

  try {
    const user = await getUser(res);
    const incoming = addCardSchema.safeParse(clearingReqBody(req));
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

      for (const field of data.properties) {
        const newField = await tx.field.upsert({
          where: {
            id: field.id,
            authorId: user.id,
          },
          update: {
            name: field.name,
          },
          create: {
            name: field.name,
            author: {
              connect: {
                id: user.id,
              },
            },
          },
        });
        await tx.cardField.create({
          data: {
            cardId: card.id,
            fieldId: newField.id,
            value: field.value,
          },
        });
      }
    });

    res.status(201).json("ok");
  } catch (error) {
    next(error);
  }
}
