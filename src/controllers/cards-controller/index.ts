import express, { NextFunction, Request, Response } from "express";
import { Card, CardProperty, Property, User } from "../../model/schemas.js";
import { DataItem, normalizeData } from "../../lib/normalizeData.js";
import { getInitData } from "../authController.js";
import { BadRequest, InternalServerError, NotFound } from "../../utils/errors.js";
import mongoose, { Document, Types } from "mongoose";
import { addCardSchema } from "../../types/zod.js";
import { addOne } from "./add-one.js";

// interface DataItem {
//   _id: string;
//   word?: string | null | undefined;
//   translate?: string | null | undefined;
//   definition?: string | null | undefined;
// }

async function getUser(res: Response) {
  const tgId = getInitData(res)?.user?.id;
  if (!tgId) {
    throw new BadRequest("User ID (tgId) is missing");
  }

  const user = await User.findOne({ tgId }).exec();
  if (!user) {
    throw new NotFound("User not found");
  }
  return user;
}

function clearingReqBody(req: Request) {
  const { _id, author, ...rest } = req.body;
  return rest;
}

class wordsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getUser(res);
      const rawData = await Card.find({
        author: user._id,
      })
        .populate("properties", { __v: 0 })
        .select({ __v: 0 })
        .exec();

      const data: DataItem[] = rawData.map((doc) => {
        const { _id, author, ...rest } = doc.toObject();
        return {
          _id: doc.id,
          properties: doc.properties,
          // ...rest,
        };
      });

      const normalizedData = normalizeData(data);
      res.json(normalizedData);
    } catch (error) {
      next(error);
    }
  }

async addOne(req: Request, res: Response, next: NextFunction) {
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
              console.log(prop);
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
  async updateOne(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await getUser(res);
      if (!req.body.word || !req.body._id) {
        throw new BadRequest("Word and ID are required");
      }

      // const data = clearingReqBody(req);
      const data = req.body;
      const word = await Word.findOne({
        _id: data._id,
        author: user._id,
      }).session(session);
      if (!word) {
        throw new NotFound("No word found to update");
      }

      await Word.findByIdAndUpdate(word._id, { word: data.word }, { session });

      const existingProps = await WordProperty.find({ word: word._id }).session(
        session
      );
      const existingPropIds = new Set(
        existingProps.map((prop) => prop._id.toString())
      );
      const newPropIds = new Set(
        data.properties.map((prop: { _id: string }) => prop._id)
      );

      const propsToDelete = [...existingPropIds].filter(
        (id) => !newPropIds.has(id)
      );
      if (propsToDelete.length > 0) {
        await WordProperty.deleteMany({ _id: { $in: propsToDelete } }).session(
          session
        );
      }

      const bulkOps = data.properties.map(
        (prop: { _id: string; name: string; value: string }) => {
          if (existingPropIds.has(prop._id)) {
            return {
              updateOne: {
                filter: { _id: prop._id },
                update: { name: prop.name, value: prop.value },
              },
            };
          } else {
            return {
              insertOne: {
                document: {
                  word: word._id,
                  name: prop.name,
                  value: prop.value,
                },
              },
            };
          }
        }
      );

      if (bulkOps.length > 0) {
        const result = await WordProperty.bulkWrite(bulkOps, { session });

        if (result.insertedIds) {
          const insertedIds = Object.values(result.insertedIds);
          await Word.findByIdAndUpdate(
            word._id,
            { $push: { properties: { $each: insertedIds } } },
            { session }
          );
        }
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ id: word.id });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const ids: string[] = req.body.ids;
      if (!ids || ids.length === 0) {
        throw new BadRequest("No IDs provided");
      }
      const user = await getUser(res);

      const wordsToDelete = await Word.find({
        _id: { $in: ids },
        author: user._id,
      }).session(session);

      if (wordsToDelete.length === 0) {
        throw new NotFound("No words found to delete");
      }

      const wordIds = wordsToDelete.map((word) => word._id);

      await WordProperty.deleteMany({ word: { $in: wordIds } }).session(
        session
      );

      const result = await Word.deleteMany({ _id: { $in: wordIds } }).session(
        session
      );

      await session.commitTransaction();
      session.endSession();

      res.json(result);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error);
    }
  }
}

export default new wordsController();
