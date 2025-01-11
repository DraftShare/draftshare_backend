import crypto from "crypto";
import jwt from "jsonwebtoken";

import express, { NextFunction, Request, Response } from "express";
import { parse, validate, validate3rd } from "@telegram-apps/init-data-node";

const validateTelegramAuth = (initData: string): boolean => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Bot token not found");

  const secret = crypto.createHash("sha256").update(token).digest();
  const urlParams = new URLSearchParams(decodeURIComponent(initData));
  const authData = Object.fromEntries(urlParams.entries());

  try {
    console.log("tma: ", validate(initData, token));
  } catch (e) {
    console.log(e);
  }
  console.log("Auth Data:", authData);

  const hash = authData.hash;
  delete authData.hash;
  delete authData.signature;

  const dataCheckString = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key]}`)
    .join("\n");

  console.log("Data Check String:", dataCheckString);

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  console.log("Calculated HMAC:", hmac);
  console.log("Hash from Telegram:", hash);

  return hmac === hash;
};

const generateJWT = (user: any) => {
  const payload = { id: user._id, telegramId: user.telegramId };
  if (process.env.JWT_SECRET) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  }
};

class AuthController {
  async authTelegram(req: Request, res: Response) {
    // const { initData } = req.body;
    if (!req.headers.authorization) {
      res
        .status(401)
        .json({ error: "req.headers.authorization === undefined" });
      return;
    }
    const initData = req.headers.authorization.split(" ")[1];
    console.log(initData);

    if (!validateTelegramAuth(initData)) {
      res.status(401).json({ error: "Invalid Telegram data" });
      return;
    }

    // Логика авторизации или создания пользователя
    const userData = JSON.parse(initData); // Данные пользователя из Telegram
    // const user = await User.findOneAndUpdate(
    //   { telegramId: userData.id },
    //   { $set: { ...userData } },
    //   { new: true, upsert: true }
    // );

    // Генерация JWT токена
    const token = generateJWT(userData);
    res.json({ token });
  }
}

export default new AuthController();
