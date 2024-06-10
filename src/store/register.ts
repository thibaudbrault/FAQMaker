import { atomWithStorage } from 'jotai/utils';

import type { RegisterInfo } from '@/types';

export const registerAtom = atomWithStorage<RegisterInfo>('register-data', {
  company: '',
  companyEmail: '',
  domain: null,
  email: '',
  plan: 'free',
});
