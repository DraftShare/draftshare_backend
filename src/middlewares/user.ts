import { RequestHandler } from "express";
import { getInitData } from "../controllers/authController.js";
import { User } from "../model/schemas.js";

export const userMiddleware: RequestHandler = async (req, res, next) => {
  const initData = getInitData(res);

  if (!initData) return next(new Error("initData == undefined"));

  let user = await User.findOne({ tgId: initData.user?.id });

  if (!user)
    user = await User.create({
      tgId: initData.user?.id,
      username: initData.user?.username,
    });

  res.locals.userId = user.id;

  return next();
};
