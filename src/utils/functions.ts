/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export const arraysAreEqual = (array1: any[], array2: any[]) =>
  array1.length === array2.length &&
  array1.every((value, index) => value === array2[index]);
