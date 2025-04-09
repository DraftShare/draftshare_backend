import { RequestHandler } from "express";
import { getInitData } from "../controllers/authController.js";
import { User } from "../model/schemas.js";
import { BadRequest } from "../utils/errors.js";
import { PrismaClient } from "@prisma/client";
import gPrisma from "../../prisma/prisma-client.js"

export const userMiddleware: RequestHandler = async (req, res, next) => {
  const prisma = gPrisma;

  try {
    const initData = getInitData(res);
    if (!initData || !initData.user) {
      throw new BadRequest("initData is required");
    }

    // let user = await prisma.user.findUnique({
    //   where: {
    //     tgId: initData.user?.id,
    //   },
    // });

    // if (!user) {
    //   user = await prisma.user.create({
    //     data: {
    //       tgId: initData.user.id,
    //       // username: initData.user.username,
    //     },
    //   });
    // }

    const user = await prisma.user.upsert({
      where: {
        tgId: String(initData.user?.id),
      },
      update: {},
      create: {
        tgId: String(initData.user?.id),
        // username: initData.user.username,
      },
    });

    res.locals.userId = user.id;

    return next();
  } catch (error) {
    return next(error);
  }
};
