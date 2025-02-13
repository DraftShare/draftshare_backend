// import crypto from "crypto";
// import jwt from "jsonwebtoken";

// import express, { NextFunction, Request, Response } from "express";

// const validateTelegramAuth = (initData: string): boolean => {
//   const token = process.env.TELEGRAM_BOT_TOKEN;
//   if (!token) throw new Error("Bot token not found");

//   // Создаем секретный ключ
//   const secret = crypto.createHash("sha256").update(token).digest();

//   // Парсим initData
//   const urlParams = new URLSearchParams(initData);

//   // Извлекаем хэш
//   const hash = urlParams.get("hash");
//   if (!hash) throw new Error("Hash not found in initData");

//   // Удаляем hash и signature из URLSearchParams
//   urlParams.delete("hash");
//   urlParams.delete("signature");

//   // Формируем строку для проверки (в закодированном виде)
//   const dataCheckString = Array.from(urlParams.entries())
//     .sort(([key1], [key2]) => key1.localeCompare(key2)) // Сортируем по ключам
//     .map(([key, value]) => `${key}=${value}`) // Сохраняем закодированные значения
//     .join("\n");

//   console.log("Data Check String:", dataCheckString);

//   // Вычисляем HMAC
//   const hmac = crypto
//     .createHmac("sha256", secret)
//     .update(dataCheckString)
//     .digest("hex");

//   console.log("Calculated HMAC:", hmac);
//   console.log("Hash from Telegram:", hash);

//   // Сравниваем HMAC с хэшем
//   return hmac === hash;
// };

// export const authMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.headers.authorization) {
//     res.status(401).json({ error: "req.headers.authorization === undefined" });
//     return;
//   }
//   const [authType, authData = ""] = (req.header("authorization") || "").split(
//     " "
//   );
//   // console.log(authData)
//   switch (authType) {
//     case "tma":
//       try {
//         if (process.env.TELEGRAM_BOT_TOKEN)
//           if (!validateTelegramAuth(authData)) {
//             res.status(401).json({ error: "Invalid Telegram data" });
//             return;
//           }
//         // Parse init data. We will surely need it in the future.
//         // setInitData(res, parse(authData));
//         return next();
//       } catch (e) {
//         return next(e);
//       }
//     // ... other authorization methods.
//     default:
//       return next(new Error("Unauthorized"));
//   }
// };

// const generateJWT = (user: any) => {
//   const payload = { id: user._id, telegramId: user.telegramId };
//   if (process.env.JWT_SECRET) {
//     return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
//   }
// };

// class AuthController {
//   async authTelegram(req: Request, res: Response) {
//     // const { initData } = req.body;
//     if (!req.headers.authorization) {
//       res
//         .status(401)
//         .json({ error: "req.headers.authorization === undefined" });
//       return;
//     }
//     const initData = req.headers.authorization.split(" ")[1];
//     // console.log(initData);

//     if (!validateTelegramAuth(initData)) {
//       res.status(401).json({ error: "Invalid Telegram data" });
//       return;
//     }
//     // Логика авторизации или создания пользователя

//     const urlParams = new URLSearchParams(decodeURIComponent(initData));
//     const userData = Object.fromEntries(urlParams.entries());

//     // const user = await User.findOneAndUpdate(
//     //   { telegramId: userData.id },
//     //   { $set: { ...userData } },
//     //   { new: true, upsert: true }
//     // );

//     // Генерация JWT токена
//     const token = generateJWT(userData);
//     res.json({ token });
//   }
// }

// export default new AuthController();

import {
  validate,
  parse,
  InitData,
  isValid,
} from "@telegram-apps/init-data-node";
import express, {
  type ErrorRequestHandler,
  type RequestHandler,
  type Response,
} from "express";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("Bot token not found");

function setInitData(res: Response, initData: InitData): void {
  res.locals.initData = initData;
}

export function getInitData(res: Response): InitData | undefined {
  return res.locals.initData;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const [authType, authData = ""] = (req.header("authorization") || "").split(
    " "
  );

  switch (authType) {
    case "tma":
      try {
        validate(authData, token, {
          // We consider init data sign valid for 1 hour from their creation moment.
          // expiresIn: 3600,
        });

        setInitData(res, parse(authData));
        return next();
      } catch (e) {
        return next(e);
      }
    case "test":
      if (process.env.NODE_ENV === "development") {
        setInitData(res, {
          authDate: new Date(),
          hash: "abc",
          signature: "zxy",
          user: {
            id: 1,
            firstName: "Bob",
            username: "BB",
          },
        });
        console.log(getInitData(res)?.user?.id)
        return next();
      }

    // ... other authorization methods.
    default:
      return next(new Error("Unauthorized"));
  }
};

export const showInitDataMiddleware: RequestHandler = (_req, res, next) => {
  const initData = getInitData(res);
  if (!initData) {
    return next(
      new Error("Cant display init data as long as it was not found")
    );
  }
  res.json(initData);
};

