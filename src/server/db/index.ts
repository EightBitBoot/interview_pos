import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres"

import * as authSchema from "./schemas/authSchema";
import * as posSchema from "./schemas/posSchema"

export const db = drizzle(sql, { schema: {...authSchema, ...posSchema} });
// export const db = drizzle(env.DATABASE_URL);
