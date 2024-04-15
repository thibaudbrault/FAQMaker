export const OFFSET = 15;
export const MAX_FILE_SIZE = 1024 * 1024 * 5;
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg',
];
export const ROLE = ['user', 'admin', 'tenant'] as const;
export const PLAN = ['free', 'startup', 'enterprise'] as const;
