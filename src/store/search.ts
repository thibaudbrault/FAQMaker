import { atom } from 'jotai';
import { atomWithLocation } from 'jotai-location';

export const locationAtom = atomWithLocation();
export const searchQueryAtom = atom(
  (get) => get(locationAtom).searchParams?.get('search'),
);
