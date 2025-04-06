import { z } from "zod";

export const fieldIdSchema = z.number();
export const fieldNameSchema = z.string();
export const fieldValueSchema = z.string();

export const fieldSchema = z.object({
  id: fieldIdSchema,
  name: fieldNameSchema,
  value: fieldValueSchema,
});

const addFieldSchema = z.object({
  name: z.string(),
});
export const addFieldsSchema = z.object({
  fields: z.array(addFieldSchema),
});

export const deleteFieldsSchema = z.object({
  ids: z.array(fieldIdSchema),
});

export const updateFieldsSchema = z.array(
  z.object({
    id: fieldIdSchema,
    name: fieldNameSchema,
  })
);

export const upsertAndDeleteSchema = z.object({
  fieldsToDelete: z.array(fieldIdSchema),
  fieldsToUpsert: z.array(
    z.object({
      id: z.optional(fieldIdSchema),
      name: fieldNameSchema,
    })
  ),
});
