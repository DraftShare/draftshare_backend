import { z } from "zod";
import {
  fieldIdSchema,
  fieldNameSchema,
  fieldSchema,
  fieldValueSchema,
} from "../fields-controller/types.js";

const cardIdShcema = z.number();

export const addCardSchema = z.object({
  fields: z.array(
    z.object({
      name: fieldNameSchema,
      value: fieldValueSchema,
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

export const updateCardSchema = z.object({
  id: cardIdShcema,
  fields: z.array(
    z.object({
      name: fieldNameSchema,
      value: fieldValueSchema,
    })
  ),
});

export const deleteCardsSchema = z.object({
  ids: z.array(cardIdShcema),
});

export type field = z.infer<typeof fieldSchema>;
