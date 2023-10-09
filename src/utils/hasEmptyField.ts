export const hasEmptyField = (obj) => {
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      typeof obj[key] === 'string' &&
      obj[key] === ''
    ) {
      return true;
    }
  }
  return false;
};
