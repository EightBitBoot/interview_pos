import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "~/env";

import * as authSchema from "./schemas/authSchema";
import * as posSchema from "./schemas/posSchema"

export const db = drizzle(env.DATABASE_URL, { schema: {...authSchema, ...posSchema} });
// export const db = drizzle(env.DATABASE_URL);
