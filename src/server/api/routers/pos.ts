import {
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc';

import { sql } from 'drizzle-orm';

import { z } from 'zod';
import { transactionAddons, transactionItems, transactions } from '~/server/db/schemas/posSchema';

export const apiTransactionItemSchema = z.object({
  id: z.number(),
  addons: z.array(z.object({
    id: z.number(),
    quantity: z.number(),
  }))
});

export const apiTransactionSchema = z.object({
  restaurantId: z.number(),
  items: z.array(apiTransactionItemSchema),
  tipAmount: z.number(),
})

export const posRouter = createTRPCRouter({
  submitTransaction: publicProcedure
    .input(apiTransactionSchema)
    .mutation(async ({ input, ctx }) => {
      let timestamp = sql`now()`;

      let transInsRes = await ctx.db.insert(transactions)
        .values({
          restaurantId: input.restaurantId,
          timestamp: timestamp,
          tipAmount: input.tipAmount
        })
        .returning({ transactionId: transactions.id });

      let transactionId = transInsRes[0]!.transactionId

      input.items.forEach(async (item) => {
        let transItemRes = await ctx.db.insert(transactionItems)
          .values({ transactionId, itemId: item.id })
          .returning({ transactionItemId: transactionItems.id })

        let transactionItemId = transItemRes[0]!.transactionItemId;

        item.addons.forEach(async (addon) => {
          ctx.db.insert(transactionAddons)
            .values({transactionItemId, addonId: addon.id, quantity: addon.quantity})
        })
      })
    }),
});
