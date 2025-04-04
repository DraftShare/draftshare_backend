import { z } from "zod";

const setIdSchema = z.number();

export const upsertDataSchema = z.object({
  id: z.optional(setIdSchema),
  name: z.string(),
  fields: z.array(z.string()),
});

export const deleteIdsSchema = z.array(setIdSchema);
