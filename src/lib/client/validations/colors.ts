import { z } from 'zod';

export const colorsClientSchema = z.object({
  foreground: z
    .string()
    .trim()
    .regex(
      new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
      'Invalid hex color code',
    )
    .optional(),
  background: z
    .string()
    .trim()
    .regex(
      new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
      'Invalid hex color code',
    )
    .optional(),
  border: z
    .string()
    .trim()
    .regex(
      new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
      'Invalid hex color code',
    )
    .optional(),
});
