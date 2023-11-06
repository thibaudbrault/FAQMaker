import { atom } from 'jotai';

import { RegisterInfo } from '@/types';

export const registerAtom = atom<RegisterInfo>({
  company: '',
  companyEmail: '',
  domain: '',
  email: '',
  plan: 'free',
});
