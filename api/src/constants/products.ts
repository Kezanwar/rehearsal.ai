export const PRODUCTS = {
  CREDITS_1: "rehearsal_credits_1",
  CREDITS_5: "rehearsal_credits_5",
  CREDITS_10: "rehearsal_credits_10",
} as const;

export const PRODUCT_CREDITS = {
  [PRODUCTS.CREDITS_1]: 1,
  [PRODUCTS.CREDITS_5]: 5,
  [PRODUCTS.CREDITS_10]: 10,
};

export const PRODUCT_AMOUNT_PENCE = {
  [PRODUCTS.CREDITS_1]: 150,
  [PRODUCTS.CREDITS_5]: 500,
  [PRODUCTS.CREDITS_10]: 800,
};
