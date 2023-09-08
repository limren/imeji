import * as jwt from "jsonwebtoken";

export const decodeAndVerifyJwtToken = async (token: string) => {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) return undefined;
  console.log("jwt token :", jwt.verify(token, privateKey));
  return jwt.verify(token, privateKey);
};
