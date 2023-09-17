const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';
const special = '!"#$%&\'*+-_,./:;=?@\\^`|~[]{}()<>';

export const generatePassword = () => {
  let password = '';
  let pool = upperCase + lowerCase + digits + special;

  for (let i = 0; i < 10; i++) {
    password += pool.charAt(Math.random() * pool.length);
  }

  return password;
};
