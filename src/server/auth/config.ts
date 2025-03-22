import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schemas/authSchema";
import { eq } from "drizzle-orm";
import { employees, UserRole } from "../db/schemas/posSchema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      role: UserRole;
      restaurantId: number;
      name: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  //   id: number,
  //   role: UserRole,
  //   restaurantId: number,
  //   name: string,
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider,
    CredentialsProvider({
      name: "POS Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username"},
        password: { label: "Password", type: "password"}
      },

      authorize: async (creds) => {
        const {username, password} = creds as {username: string, password: string};

        const queryRes = await db.select().from(employees)
          .where(eq(employees.username, username));

        if(queryRes.length == 0) {
          throw new Error(`Username ${username} not found!`)
        }

        let employee = queryRes[0]!;
        if(password != employee.password) {
          throw new Error("Invalid password!")
        }

        return {
          id: employee.id,
          name: employee.name,
          restaurantId: employee.restaurantId,
          role: employee.role,
        }
      },

    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
