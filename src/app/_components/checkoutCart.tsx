// NOTE(Adin): Implicitly 'use client' under posDisplay.tsx

import { api } from '~/trpc/react';

import Card from '~/app/components/card';
import { getConfItemPrice, getTotalFromConfItems } from './confItem';
import type { ConfiguredItem } from './confItem';

import { formatCurrency } from '~/utils/uiUtils';
import { CheckoutItem } from './posDisplay';

function CheckoutCard({ checkoutItem }: { checkoutItem: CheckoutItem }) {
  return (
    <Card>
      <div>
        <span className="text-2xl font-semibold">{checkoutItem.quantity}x: {checkoutItem.confItem.item.name}</span>: <span className="text-l">${formatCurrency(checkoutItem.confItem.item.basePrice)}</span>
      </div>

      <div>
        <ul className="list-decimal pl-10">
          {
            checkoutItem.confItem.addons.map((addon) => {
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

      <div className="text-2xl font-semibold">${formatCurrency(getConfItemPrice(checkoutItem.confItem))}</div>
    </Card>
  );
}

function CheckoutRow({ onCheckout, total }: { onCheckout: () => void, total: number }) {
  return (
    <div className="flex flex-row gap-2">
      <button
        className="p-50 border-2 border-black box-border bg-gray-50 rounded-xl drop-shadow-lg p-5 w-[30%]"
        onClick={onCheckout}
      >
        Check Out
      </button>
      <span className="text-xl font-semibold text-center pt-5 pb-5">Total: ${formatCurrency(total)}</span>
    </div>

  );
}

type CheckoutCartProps = {
  configuredItems: [string, CheckoutItem][],
  onCheckout: () => void,
}

export default function CheckoutCart({ configuredItems, onCheckout }: CheckoutCartProps) {
  return (
    <>
      <div className="flex flex-col gap-2 p-2">
        {
          configuredItems.map(([id, item]) => {
            return (
              <CheckoutCard key={id} checkoutItem={item} />
            );
          })
        }


      </div>
      <div className="p-2">
        <CheckoutRow onCheckout={onCheckout} total={getTotalFromConfItems(configuredItems.map(([_, item]) => item))} />
      </div>
    </>
  )
}
