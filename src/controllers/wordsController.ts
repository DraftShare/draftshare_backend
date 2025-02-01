import express, { NextFunction, Request, Response } from "express";
import { User, Word } from "../model/schemas.js";
import { normalizeData } from "../lib/normalizeData.js";
import { getInitData } from "./authController.js";
import { BadRequest, NotFound } from "../utils/errors.js";

interface DataItem {
  id: string;
  word?: string | null | undefined;
  translate?: string | null | undefined;
  definition?: string | null | undefined;
}

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

class wordsController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getUser(res);
      const rawData = await Word.find({
        author: user._id,
      })
        .select({ __v: 0 })
        .exec();

      const data: DataItem[] = rawData.map((doc) => ({
        id: doc.id,
        word: doc.word,
        ...doc.toObject(),
      }));

      const normalizedData = normalizeData(data);
      res.json(normalizedData);
    } catch (error) {
      next(error);
    }
  }

  async addOne(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await getUser(res);
      if (!req.body.word) {
        throw new BadRequest("Word is required");
      }
      const newWord = await Word.create({ ...req.body, author: user._id });
      res.status(201).json({ id: newWord.id });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const ids: string[] = req.body.ids;
      if (!ids || ids.length === 0) {
        throw new BadRequest("No IDs provided");
      }
      const user = await getUser(res);

      const result = await Word.deleteMany({ _id: { $in: ids }, author: user });
      if (result.deletedCount === 0) {
        throw new NotFound("No words found to delete");
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new wordsController();
