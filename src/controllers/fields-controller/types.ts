import { z } from "zod";
import { fieldNameSchema } from "../../types/zod.js";

const fieldSchema = z.object({
  name: z.string(),
});

export const addFieldSchema = z.object({
  fields: z.array(fieldSchema),
});

export const deleteFieldsSchema = z.object({
  names: z.array(fieldNameSchema),
});

export const updateFieldsSchema = z.array(
  z.object({
    oldName: fieldNameSchema,
    newName: fieldNameSchema,
  })
);
