import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { Me, RegisterInfo } from '@/types';

export const registerAtom = atomWithStorage<RegisterInfo>('register-data', {
  company: '',
  companyEmail: '',
  email: '',
  plan: 'free',
});

export const themeAtom = atomWithStorage('theme', 'neutral');

export const userAtom = atom<Me | null>(null);
