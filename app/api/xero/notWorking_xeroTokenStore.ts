// xeroTokenStore.ts
let xeroToken: unknown = null;

export const setXeroToken = (token: unknown) => {
  xeroToken = token;
};

export const getXeroToken = () => xeroToken;
