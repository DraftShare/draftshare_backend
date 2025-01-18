import express, { Request, Response } from "express";
import { Word } from "../model/schemas.js";
import { normalizeData } from "../lib/normalizeData.js";

interface DataItem {
  id: string;
  word?: string | null | undefined;
  translate?: string | null | undefined;
  definition?: string | null | undefined;
}

class wordsController {
  async getAll(req: Request, res: Response) {
    try {
      const rawData = await Word.find().select({ __v: 0 });

      const data: DataItem[] = rawData.map((doc) => ({
        id: doc.id,
        word: doc.word,
        ...doc.toObject(),
      }));

      const normalizedData = normalizeData(data);
      res.json(normalizedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  }

  async addOne(req: Request, res: Response) {
    // const newWord = await Word.create({
    //   word: req.body.word,
    //   transcription: req.body.transcription,
    //   translate: req.body.translate,
    //   definition: req.body.definition,
    // });
    // console.log(req.body);
    const newWord = await Word.create(req.body);
    res.json({ id: newWord.id});
  }

  async delete(req: Request, res: Response) {
    const ids: string[] = req.body.ids;
    const result = await Word.deleteMany({ _id: { $in: ids } });

    res.json(result);
  }
}

export default new wordsController();
