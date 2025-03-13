import express, { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { clearingReqBody, getUser } from "./utils.js";
import { addCardSchema } from "../../types/zod.js";
import { BadRequest, InternalServerError } from "../../utils/errors.js";
import { Card, CardProperty, Property } from "../../model/schemas.js";

export async function addOne(req: Request, res: Response, next: NextFunction) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await getUser(res);

      const incoming = addCardSchema.safeParse(clearingReqBody(req));
      if (!incoming.success) {
        throw new BadRequest("Incorrect data was received");
      }
      const data = incoming.data;

      const [card] = await Card.create([{ author: user._id }], { session });

      await Promise.all(
        data.properties.map(
          async (item: {
            name: string;
            value: string;
          }): Promise<{
            card: Types.ObjectId;
            property: Types.ObjectId;
            value: string;
          }> => {
            const prop = await Property.findOneAndUpdate(
              { name: item.name, author: user._id },
              { name: item.name, author: user._id },
              { upsert: true, new: true, session }
            );

            if (!prop) {
              throw new InternalServerError(
                "The property could not be found or created"
              );
            }

            // Создаем связь между картой и свойством
            const cardProperty = await CardProperty.create(
              [{ card: card._id, property: prop._id, value: item.value }],
              { session }
            );

            // Обновляем массив properties в документе Card
            await Card.findByIdAndUpdate(
              card._id,
              { $push: { properties: cardProperty[0]._id } },
              { session }
            );

            // Обновляем массив cardProperties в документе Property
            await Property.findByIdAndUpdate(
              prop._id,
              { $push: { cardProperties: cardProperty[0]._id } },
              { session }
            );

            return { card: card._id, property: prop._id, value: item.value };
          }
        )
      );

      res.status(201).json({ id: card._id });
    });

    session.endSession();
  } catch (error) {
    session.endSession();
    next(error);
  }
}
