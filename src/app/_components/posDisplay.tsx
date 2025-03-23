'use client';

import { useState, } from 'react';

import { ToastContainer, toast } from 'react-toastify';

import ItemsList from './itemList';
import CheckoutCart from './checkoutCart';

import type { MenuWithItemsAndAddons } from "~/server/db/schemas/posSchema";
import type { ConfiguredItem } from './confItem';
import { api } from '~/trpc/react';

export default function PosDisplay({ restaurantId, currentMenu }: { restaurantId: number, currentMenu: MenuWithItemsAndAddons }) {
  const transactionMutation = api.pos.submitTransaction.useMutation();

  const [checkoutItems, setCheckoutItems] = useState<ConfiguredItem[]>([]);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<number>(restaurantId);

  function handleAddItem(item: ConfiguredItem) {
    const newCheckoutItems = checkoutItems.slice()
    const newItem = {
      item: item.item,
      addons: item.addons.filter((addon) => {
        return addon.quantity > 0;
      })
    }
    newCheckoutItems.push(newItem);
    setCheckoutItems(newCheckoutItems);
  }

  function handleCheckout() {
    const transaction = {
      restaurantId,
      tipAmount: 0,
      items: checkoutItems.map((item) => {
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

    transactionMutation.mutate(transaction, { onSettled(data, error, variables, context) {
      if(error) {
        toast("Transaction Failed!")
      }
      else {
        toast("Transaction Completed!")
        setCheckoutItems([]);
      }
    },});

  }

  { /*
       NOTE(Adin): This is a hacky fix for the demo demo so that the cart
                   clears when the restaurant changes. In a real system,
                   the restaurant will never change without a logout and
                   complete refresh (clearing the cart anyway).
  */ }
  if (restaurantId !== currentRestaurantId) {
    setCheckoutItems([]);
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
          <CheckoutCart configuredItems={checkoutItems} onCheckout={handleCheckout} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
