import { z } from "zod";

const cardIdShcema = z.number();
const cardPropertyId = z.number();

const propertyIdSchema = z.number();
const propertyNameSchema = z.string();
const propertyValueSchema = z.string();

const addCardPropertySchema = z.object({
  id: z.optional(cardPropertyId),
  name: propertyNameSchema,
  value: propertyValueSchema,
});
export const addCardSchema = z.object({
  properties: z.array(addCardPropertySchema),
});

const updatePropertySchema = z.object({
  _id: z.optional(propertyIdSchema),
  name: propertyNameSchema,
  value: propertyValueSchema,
});
export const updateCardSchema = z.object({
  _id: cardIdShcema,
  properties: z.array(updatePropertySchema),
});

export const deleteCardsSchema = z.object({
  ids: z.array(cardIdShcema),
});
