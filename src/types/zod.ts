import { z } from "zod";

const cardIdShcema = z.number();

const fieldNameSchema = z.string();
const fieldValueSchema = z.string();

const fieldSchema = z.object({
  name: fieldNameSchema,
  value: fieldValueSchema,
});
export const addCardSchema = z.object({
  fields: z.array(fieldSchema),
});

export const updateCardSchema = z.object({
  id: cardIdShcema,
  // fields: z.array(fieldSchema),
  fieldsToDelete: z.array(fieldSchema),
  // fieldsToUpdate: z.array(fieldSchema),
  // fieldsToCreate: z.array(fieldSchema),
  fieldsToUpsert: z.array(fieldSchema),
});

export const deleteCardsSchema = z.object({
  ids: z.array(cardIdShcema),
});

export type field = z.infer<typeof fieldSchema>;
