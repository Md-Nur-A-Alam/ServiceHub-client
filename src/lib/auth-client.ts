import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

const serverURL = process.env.SERVER_PRODUCTION_URL || process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL || "http://localhost:8000";

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
