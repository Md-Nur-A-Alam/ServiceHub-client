import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL as string;

export const authClient = createAuthClient({
  baseURL: serverURL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    }),
  ],
});
