export const ItemStatus = {
  ON_SALE: 'ON_SALE',
  SOLD_OUT: 'SOLD_OUT',
} as const;
export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];
