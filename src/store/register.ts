import { atomWithStorage } from 'jotai/utils';

import type { RegisterInfo } from '@/types';

export const registerAtom = atomWithStorage<RegisterInfo>('register-data', {
  company: '',
  companyEmail: '',
  email: '',
  plan: 'free',
});
