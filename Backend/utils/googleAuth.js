import { OAuth2Client } from "google-auth-library";

let googleClient;

const getGoogleClient = () => {
  if (!googleClient) {
    googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  return googleClient;
};

export const verifyGoogleToken = async (credential) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google client id is not configured");
  }

  const client = getGoogleClient();
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  return ticket.getPayload();
};
