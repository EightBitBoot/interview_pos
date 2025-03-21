import { NextResponse } from 'next/server';

import { reset } from 'drizzle-seed'

import { db } from "~/server/db";
import * as schemas from '~/server/db/schemas/posSchema';

export async function GET() {
  try {
    await reset(db, schemas);
    return NextResponse.json({status: "Success"}, {status: 200})
  }
  catch(error) {
    return new NextResponse(JSON.stringify(error, Object.getOwnPropertyNames(error)), {status: 500});
  }
}
