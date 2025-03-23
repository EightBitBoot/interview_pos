
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

export type TransactionWithItems = Awaited<ReturnType<(typeof getTransactions)>>[number];

export default async function TransactionsPage() {
  // NOTE(Adin): The database is basically guaranteed to have
  //             a restaurant with an id of 1
  const transactions = await getTransactions(1);
  const displayTransactions = transactions.map(({transactionItems, restaurantId, ...transaction}) => {
    return {
      ...transaction,

      subTotal: transactionItems.reduce((acc, transactionItem) => {
        return acc + transactionItem.item.basePrice + transactionItem.transactionAddons.reduce((acc, transactionAddon) => {
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
            <th className="p-3 align-center align-middle" scope="columns">Sub Total</th>
            <th className="p-3 align-center align-middle" scope="columns">Tip Amount</th>
            <th className="p-3 align-center align-middle" scope="columns">Tax Collected</th>
            <th className="p-3 align-center align-middle" scope="columns">Total Collected</th>
          </tr>
        </thead>
        <tbody>
          {
            displayTransactions.map((transaction, index) => {
              return (
                <tr key={transaction.id} className="border-l-transparent border-r-transparent">
                  <th scope="rows">{index + 1}.</th>
                  <td className="p-3">{transaction.timestamp.toString()}</td>
                  <td className="p-3">${formatCurrency(transaction.subTotal)}</td>
                  <td className="p-3">${formatCurrency(transaction.tipAmount)}</td>
                  <td className="p-3">${formatCurrency(transaction.taxAmount)}</td>
                  <td className="p-3">${formatCurrency(transaction.subTotal + transaction.tipAmount + transaction.taxAmount)}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
  );
}
