
import { db } from "./index"

export async function getAllRestaurantData() {
  return await db.query.restaurants.findMany({
    with: {
      menus: {
        with: {
          items: {
            with: {
              addons: true
            },
          },
        },
      },
    },
  })
}
