import { RegisterInfo } from '@/types';
import { atom } from 'jotai';

export const registerAtom = atom<RegisterInfo>({
  company: '',
  companyEmail: '',
  email: '',
  plan: 'free',
});
