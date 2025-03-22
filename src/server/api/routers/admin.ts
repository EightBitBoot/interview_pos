import {
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc';

import { getAllRestaurantData } from '~/server/db/util';
import { items, itemUpdateZodSchema } from '~/server/db/schemas/posSchema';

import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const adminRouter = createTRPCRouter({
  // TODO(Adin): Make this a protecte procedure
  getRestaurants: publicProcedure
    .query(async ({}) => {
      return getAllRestaurantData()
    }),

  updateItem: publicProcedure
    .input(itemUpdateZodSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const itemToSubmit = {
          menuId: input.menuId,
          name: input.name,
          description: input.description,
          basePrice: input.basePrice
        }

        await ctx.db.update(items)
          .set(itemToSubmit)
          .where(eq(items.id, input.id))
      }
      catch(error) {
        console.log(error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error updating item ${input.name}`,
          cause: error
        })
      }
    }),
});
