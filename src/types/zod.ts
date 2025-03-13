import { z } from "zod";

const cardIdShcema = z.string();

const propertyIdSchema = z.string();
const propertyNameSchema = z.string();
const propertyValueSchema = z.string();



const addCardPropertySchema = z.object({
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