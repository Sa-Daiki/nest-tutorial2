export const UserStatus = {
  FREE: 'FREE',
  PREMIUM: 'PREMIUM',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
