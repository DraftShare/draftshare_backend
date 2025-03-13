import express, { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { clearingReqBody, getUser } from "./utils.js";
import {
  BadRequest,
  InternalServerError,
  NotFound,
} from "../../utils/errors.js";
import { Card, CardProperty, Property } from "../../model/schemas.js";
import { updateCardSchema } from "../../types/zod.js";

export async function updateOne(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await getUser(res);
      const incoming = updateCardSchema.safeParse(req.body);
      if (!incoming.success) {
        console.log(incoming.error);
        throw new BadRequest("Incorrect data was received");
      }
      const data = incoming.data;

      const card = await Card.findOne({
        _id: data._id,
        author: user._id,
      }).session(session);
      if (!card) {
        throw new NotFound("No card found to update");
      }

      await Promise.all(
        data.properties.map(
          async (item: {
            _id?: string | undefined;
            name: string;
            value: string;
          }) => {
            const cardProp = await CardProperty.findByIdAndUpdate(
              item._id,
              { value: item.value, card: card._id },
              { upsert: true, new: true, session }
            );
            if (!cardProp) {
              throw new InternalServerError(
                "The cardProperty could not be found or created"
              );
            }

            const prop = await Property.findByIdAndUpdate(
              cardProp.property,
              {
                name: item.name,
                author: user._id,
                $push: { cardProperties: cardProp._id },
              },
              { upsert: true, new: true, session }
            );

            if (!prop) {
              throw new InternalServerError(
                "The property could not be found or created"
              );
            }

            await Card.findByIdAndUpdate(
              card._id,
              { $push: { properties: cardProp._id } },
              { session }
            );

            await CardProperty.findByIdAndUpdate(
              item._id,
              { property: prop._id },
              { session }
            );

            return { card: card._id, property: prop._id, value: item.value };
          }
        )
      );

      const existingCardProp = await CardProperty.find({
        card: card._id,
      }).session(session);
      const existingPropIds = new Set(
        existingCardProp.map((prop) => prop._id.toString())
      );
      const newPropIds = new Set(data.properties.map((prop) => prop._id));

      const propsToDelete = [...existingPropIds].filter(
        (id) => !newPropIds.has(id)
      );
      if (propsToDelete.length > 0) {
        await CardProperty.deleteMany({ _id: { $in: propsToDelete } }).session(
          session
        );
      }

      res.status(200).json({ id: card.id });
    });
    session.endSession();
  } catch (error) {
    session.endSession();
    next(error);
  }
}
