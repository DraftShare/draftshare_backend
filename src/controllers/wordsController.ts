import express, { Request, Response } from "express";
import { Word } from "../model/schemas.js";

class wordsController {
  async getAll(req: Request, res: Response) {
    const data = await Word.find();
    res.json(data);
  }

  async addOne(req: Request, res: Response) {
    const newWord = await Word.create({
      word: req.body.word,
      translate: req.body.translate,
      definition: req.body.definition,
    });
    res.json(newWord);
  }
}

export default new wordsController();
