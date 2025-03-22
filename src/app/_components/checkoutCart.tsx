// NOTE(Adin): Implicitly 'use client' under posDisplay.tsx

import { api } from '~/trpc/react';

import Card from '~/app/components/card';
import { getConfItemPrice } from './confItem';
import type { ConfiguredItem } from './confItem';

type CheckoutHandler = () => void;

import { formatCurrency } from '~/utils/uiUtils';

function CheckoutCard({ confItem }: { confItem: ConfiguredItem }) {
  return (
    <Card>
      <div>
        <span className="text-2xl font-semibold">{confItem.item.name}</span>: <span className="text-l">${formatCurrency(confItem.item.basePrice)}</span>
      </div>

      <div>
        <ul className="list-decimal pl-10">
          {
            confItem.addons.map((addon) => {
              return (
                <li key={addon.id}>
                  <span className="font-medium">{addon.name}</span> x{addon.quantity}: ${formatCurrency(addon.price * addon.quantity)}
                </li>
              );
            })
          }
        </ul>
      </div>

      <div className="min-h-3" />

      <div className="text-2xl font-semibold">${formatCurrency(getConfItemPrice(confItem))}</div>
    </Card>
  );
}

function CheckoutButton({ handleCheckout }: { handleCheckout: CheckoutHandler }) {
  return (
    <button
      className="p-50 border-2 border-black box-border bg-gray-50 rounded-xl drop-shadow-lg p-5"
      onClick={() => handleCheckout()}
    >
      Check Out
    </button>
  );
}

export default function CheckoutCart({ configuredItems, restaurantId, onCheckout }: { configuredItems: ConfiguredItem[], restaurantId: number, onCheckout?: () => void }) {
  const transactionMutation = api.pos.submitTransaction.useMutation();

  function handleCheckout() {
    const transaction = {
      restaurantId,
      tipAmount: 0,
      items: configuredItems.map((item) => {
        return {
          id: item.item.id,
          addons: item.addons.map((addon) => {
            return {
              id: addon.id,
              quantity: addon.quantity,
            }
          })
        }
      })
    }

    transactionMutation.mutate(transaction);

    if(onCheckout) {
      onCheckout()
    }
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {
        // TODO(Adin): Better CheckoutCard key
        configuredItems.map((confItem) => {
          return (
            <CheckoutCard key={confItem.item.id} confItem={confItem} />
          );
        })
      }

      <div className="min-h-3" />

      <CheckoutButton handleCheckout={handleCheckout} />
    </div>
  )
}
