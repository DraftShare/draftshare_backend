import { z } from "zod";
import { fieldSchema } from "../fields-controller/types.js";

const cardIdShcema = z.number();

export const addCardSchema = z.object({
  fields: z.array(fieldSchema),
});

export const updateCardSchema = z.object({
  id: cardIdShcema,
  fieldsToDelete: z.array(fieldSchema),
  fieldsToUpsert: z.array(fieldSchema),
});

export const deleteCardsSchema = z.object({
  ids: z.array(cardIdShcema),
});

export type field = z.infer<typeof fieldSchema>;
