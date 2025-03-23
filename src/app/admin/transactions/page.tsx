
import { eq } from 'drizzle-orm';

import { db } from '~/server/db';
import { transactions } from '~/server/db/schemas/posSchema';
import { formatCurrency } from '~/utils/uiUtils';

async function getTransactions(restaurantId: number) {
  return await db.query.transactions.findMany({
    where: eq(transactions.restaurantId, restaurantId),
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
}

export default async function TransactionsPage() {
  // NOTE(Adin): The database is basically guaranteed to have
  //             a restaurant with an id of 1
  const transactions = await getTransactions(1);
  const displayTransactions = transactions.map((transaction) => {
    return {
      id: transaction.id,
      timestamp: transaction.timestamp,
      tipAmount: transaction.tipAmount,
      total: transaction.transactionItems.reduce((acc, transactionItem) => {
        return acc + transactionItem.item!.basePrice + transactionItem.transactionAddons.reduce((acc, transactionAddon) => {
          return acc + (transactionAddon.addon.price * transactionAddon.quantity);
        }, 0)
      }, 0),
    }
  })

  return (
      <table className="table-fixed flex-shrink max-w-100 ml-auto mr-auto border-collapse border-2 rounded-sm pt-3">
        <thead>
          <tr className="border-b-2 border-b-black">
            <td></td>
            <th className="p-3" scope="columns">Date</th>
            <th className="p-3 align-center align-middle" scope="columns">Total</th>
            <th className="p-3" scope="columns align-center align-middle">Tip Amount</th>
          </tr>
        </thead>
        <tbody>
          {
            displayTransactions.map((transaction, index) => {
              return (
                <tr key={transaction.id} className="border-l-transparent border-r-transparent">
                  <th scope="rows">{index + 1}.</th>
                  <td className="p-3">{transaction.timestamp.toString()}</td>
                  <td className="p-3">${formatCurrency(transaction.total)}</td>
                  <td className="p-3">${formatCurrency(transaction.tipAmount)}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
  );
}
