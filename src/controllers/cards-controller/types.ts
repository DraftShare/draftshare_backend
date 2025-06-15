import { z } from "zod";
import { fieldIdSchema, fieldNameSchema } from "../fields-controller/types.js";

const cardIdShcema = z.number();

export const addCardSchema = z.object({
  fields: z.array(
    z.object({
      name: fieldNameSchema,
      value: z.array(z.string()),
      // value: z.union([z.string(), z.null()]),
      // values: z.array(z.string()),
      type: z.enum(["INPUT", "TEXTAREA", "SELECT", "MULTISELECT"]),
      options: z.optional(z.array(z.string())),
      id: z.optional(z.number()),
    })
  ),
});

// export const updateCardSchema = z.object({
//   id: cardIdShcema,
//   fieldsToDelete: z.array(fieldSchema),
//   fieldsToUpsert: z.array(
//     z.object({
//       id: z.optional(fieldIdSchema),
//       name: fieldNameSchema,
//       value: fieldValueSchema,
//     })
//   ),
// });

export const updateCardSchema = addCardSchema.extend({
  id: cardIdShcema,
});

export const deleteCardsSchema = z.object({
  ids: z.array(cardIdShcema),
});

// export type field = z.infer<typeof fieldSchema>;
