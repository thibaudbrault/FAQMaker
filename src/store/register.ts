import { atomWithStorage } from 'jotai/utils';

import { RegisterInfo } from '@/types';

export const registerAtom = atomWithStorage<RegisterInfo>('register-dcdata', {
  company: '',
  companyEmail: '',
  domain: null,
  email: '',
  plan: 'free',
});
