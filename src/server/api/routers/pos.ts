import {
  createTRPCRouter,
  publicProcedure,
} from '~/server/api/trpc';

import { eq, sql } from 'drizzle-orm';

import { z } from 'zod';
import { transactionAddons, transactionItems, transactions } from '~/server/db/schemas/posSchema';
import { getTransactionTotal } from '~/utils/uiUtils';

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
      const timestamp = sql`now()`;

      const taxRate = await ctx.db.query.restaurants.findFirst({
        where: ((restaurants, { eq }) => eq(restaurants.id, input.restaurantId)),

        columns: {
          taxPercentage: true
        }
      })

      await ctx.db.transaction(async (db) => {
        const transInsRes = await db.insert(transactions)
          .values({
            restaurantId: input.restaurantId,
            timestamp: timestamp,
            tipAmount: input.tipAmount,
            taxAmount: 0,
          })
          .returning({ transactionId: transactions.id });

        const transactionId = transInsRes[0]!.transactionId

        for(const item of input.items) {
          const transItemRes = await db.insert(transactionItems)
            .values({ transactionId, itemId: item.id })
            .returning({ transactionItemId: transactionItems.id })

          const transactionItemId = transItemRes[0]!.transactionItemId;

          for(const addon of item.addons) {
            await db.insert(transactionAddons)
              .values({ transactionItemId, addonId: addon.id, quantity: addon.quantity })
          }
        }

        const transaction = await db.query.transactions.findFirst({
          where: eq(transactions.id, transactionId),
          with: {
            transactionItems: {
              columns: {},
              with: {
                item: true,
                transactionAddons: {
                  columns: {
                    quantity: true,
                  },
                  with: {
                    addon: true,
                  }
                }
              }
            }
          }
        })

        console.log(JSON.stringify(transaction, undefined, 2), taxRate, input.restaurantId)

        const tax = Math.ceil(getTransactionTotal(transaction?.transactionItems ?? []) * (parseFloat(taxRate?.taxPercentage ?? "0.0") / 100));

        await db.update(transactions).set({taxAmount: tax}).where(eq(transactions.id, transactionId));
      })
    }),
});
