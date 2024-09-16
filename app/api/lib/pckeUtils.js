import crypto from 'crypto';

export const getCodeVerifier = () => {
  const codeVerifier = crypto.randomBytes(64).toString('base64url');
  return codeVerifier;
};

export const getCodeChallenge = (codeVerifier) => {
  return crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
};
