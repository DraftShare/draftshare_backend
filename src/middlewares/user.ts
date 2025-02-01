import { RequestHandler } from "express";
import { getInitData } from "../controllers/authController.js";
import { User } from "../model/schemas.js";
import { BadRequest } from "../utils/errors.js";

export const userMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const initData = getInitData(res);

    if (!initData) throw new BadRequest("initData is required");

    let user = await User.findOne({ tgId: initData.user?.id });

    if (!user)
      user = await User.create({
        tgId: initData.user?.id,
        username: initData.user?.username,
      });

    res.locals.userId = user.id;

    return next();
  } catch (error) {
    return next(error);
  }
};
