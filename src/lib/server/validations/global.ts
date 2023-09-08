import { z } from 'zod';

export const getIdSchemaFn = (key: string) =>
  z.object({
    [key]: z.string(),
  });
