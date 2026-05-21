import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/src/lib/prisma";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      banned: {
        type: "boolean",
        defaultValue: false,
      },
      banReason: {
        type: "string",
        required: false,
      },
      banExpires: {
        type: "date",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
