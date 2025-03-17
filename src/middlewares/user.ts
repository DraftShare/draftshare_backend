import { RequestHandler } from "express";
import { getInitData } from "../controllers/authController.js";
import { User } from "../model/schemas.js";
import { BadRequest } from "../utils/errors.js";
import { PrismaClient } from "@prisma/client";

export const userMiddleware: RequestHandler = async (req, res, next) => {
  const prisma = new PrismaClient();

  try {
    const initData = getInitData(res);

    if (!initData || !initData.user || !initData.user.username)
      throw new BadRequest("initData is required");

    let user = await prisma.user.findUnique({
      where: {
        tgId: initData.user?.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          tgId: initData.user.id,
          username: initData.user.username,
        },
      });
    }

    res.locals.userId = user.id;

    return next();
  } catch (error) {
    return next(error);
  }
};
