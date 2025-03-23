import { TransactionWithItems } from '~/app/admin/transactions/page';

export function formatCurrency(pennies: number) {
  return (pennies / 100).toFixed(2);
}

export function getTransactionTotal(transactionItems: TransactionWithItems["transactionItems"]) {
  return transactionItems.reduce((acc, transactionItem) => {
    return acc +
      transactionItem.item.basePrice +
      transactionItem.transactionAddons.reduce((acc, transactionAddon) => {
        return acc + (transactionAddon.addon.price * transactionAddon.quantity);
      }, 0) // transactionAddons.reduce(...)
  }, 0) // transactionItems.reduce(...)
}
