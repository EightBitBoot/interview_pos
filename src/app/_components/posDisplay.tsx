'use client';

import { useState, } from 'react';

import { ToastContainer, toast } from 'react-toastify';

import ItemsList from './itemList';
import CheckoutCart from './checkoutCart';

import type { MenuWithItemsAndAddons } from "~/server/db/schemas/posSchema";
import { getConfItemId, type ConfiguredItem } from './confItem';
import { api } from '~/trpc/react';

export type CheckoutItem = {
  confItem: ConfiguredItem,
  quantity: number,
}

export default function PosDisplay({ restaurantId, currentMenu }: { restaurantId: number, currentMenu: MenuWithItemsAndAddons }) {
  const transactionMutation = api.pos.submitTransaction.useMutation();

  const [checkoutItems, setCheckoutItems] = useState<Map<string, CheckoutItem>>(new Map());
  const [currentRestaurantId, setCurrentRestaurantId] = useState<number>(restaurantId);

  function handleAddItem(item: ConfiguredItem) {
    const newCheckoutItems = new Map(checkoutItems);
    const newItem = {
      item: item.item,
      addons: item.addons.filter((addon) => {
        return addon.quantity > 0;
      })
    }
    const itemId = getConfItemId(newItem);
    const oldItem = newCheckoutItems.get(itemId);
    if (!!oldItem) {
      newCheckoutItems.set(itemId, { confItem: oldItem.confItem, quantity: oldItem.quantity + 1 })
    }
    else {
      newCheckoutItems.set(itemId, { confItem: newItem, quantity: 1 })
    }

    setCheckoutItems(newCheckoutItems);
  }
  {

    function handleCheckout() {
      const transaction = {
        restaurantId,
        tipAmount: 0,
        items: Array.from(checkoutItems.values()).flatMap(({ confItem: item, quantity }) => {
          return new Array<{ id: number, addons: { id: number, quantity: number, }[] }>(quantity).fill({
            id: item.item.id,
            addons: item.addons.map((addon) => {
              return {
                id: addon.id,
                quantity: addon.quantity,
              }
            })
          })
        })
      }

      transactionMutation.mutate(transaction, {
        onSettled(data, error, variables, context) {
          if (error) {
            toast("Transaction Failed!")
          }
          else {
            toast("Transaction Completed!")
            setCheckoutItems(new Map())
          }
        },
      });

    }

    { /*
       NOTE(Adin): This is a hacky fix for the demo demo so that the cart
                   clears when the restaurant changes. In a real system,
                   the restaurant will never change without a logout and
                   complete refresh (clearing the cart anyway).
  */ }
    if (restaurantId !== currentRestaurantId) {
      setCheckoutItems(new Map());
      setCurrentRestaurantId(restaurantId);
    }

    return (
      <>
        <div className="grid w-screen grid-cols-[3fr,1fr] border-2 border-black border-box rounded-xl">
          <div className="p-4px h-screen overflow-y-scroll">
            <ItemsList items={[...currentMenu.items]} onAddItem={handleAddItem} />
          </div>
          <div className="flex flex-col bg-transparent h-[100%] border-l-2 border-l-black border-t-white border-t-2 border-box overflow-y-auto">
            <h1 className="text-2xl font-bold text-center">Checkout:</h1>
            <CheckoutCart configuredItems={Array.from(checkoutItems.entries())} onCheckout={handleCheckout} />
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }
}
