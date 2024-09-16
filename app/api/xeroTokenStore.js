let xeroToken = null;

export const setXeroToken = (token) => {
  xeroToken = token;
};

export const getXeroToken = () => {
  return xeroToken;
};


export const getCodeVerifier = () => codeVerifier;