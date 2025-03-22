import {
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc';

import { getAllRestaurantData } from '~/server/db/util';

export const adminRouter = createTRPCRouter({
  // TODO(Adin): Make this a protecte procedure
  getRestaurants: publicProcedure
    .query(async ({}) => {
      return getAllRestaurantData()
    })
});
