import { NextResponse } from 'next/server';

import { seed } from 'drizzle-seed'

import { db } from "~/server/db";
import * as schemas from '~/server/db/schemas/posSchema';

const randomSeed = 1234;

export async function GET() {
  await seed(db, { restaurants: schemas.restaurants, menus: schemas.menus, items: schemas.items }, { seed: randomSeed }).refine((f) => ({
    restaurants: {
      count: 5,

      columns: {
        id: f.intPrimaryKey(),
        name: f.valuesFromArray({
          values: [
            "Applebee's",
            "Denny's",
            "Olive Garden",
            "Gadaleto's",
            "McDonald's",
            "Burger King",
            "Outback Steakhouse",
            "Jine's",
            "The Hard Rock Caffee"
          ],
          isUnique: true,
        })
      },
      with: {
        menus: [
          { weight: 0.8, count: [1, 2, 3] },
          { weight: 0.2, count: [4, 5, 6] },
        ]
      }
    },

    menus: {
      columns: {
        id: f.intPrimaryKey(),
        name: f.valuesFromArray({
          values: [
            "Sunday",
            "Weekdays",
            "Easter",
            "Christmas",
            "Kwanzaa",
            "Catering",
          ],
        })
      },
      with: {
        items: [
          { weight: 0.8, count: [6, 7, 8] },
          { weight: 0.2, count: [9, 10] },
        ]
      }
    },

    items: {
      columns: {
        id: f.intPrimaryKey(),
        name: f.valuesFromArray({
          values: [
            "Hamburger",
            "Cheeseburger",
            "Fries",
            "Milkshake",
            "Corned Beef Hash",
            "Pita Bread",
            "Naan Bread",
            "Garlic Knots",
            "Grilled Asparagus",
            "Scrambled Eggs",
            "Green Eggs and Ham",
          ],
        }),
        description: f.loremIpsum(),
        basePrice: f.int({
          minValue: 799,
          maxValue: 100000,
        })
      }
    }
  }))

  return NextResponse.json({ status: "Success" }, { status: 200 })
}
