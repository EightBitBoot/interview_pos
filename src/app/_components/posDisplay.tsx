'use client';

import { useState, ReactNode } from 'react';

import ItemsList from './itemList';
import CheckoutCart from './checkoutCart';

import type { MenuWithItemsAndAddons, ItemWithAddons } from "~/server/db/schemas/posSchema";
import type { ConfiguredItem } from './confItem';

export default function PosDisplay({ currentMenu }: { currentMenu: MenuWithItemsAndAddons }) {
  function placeholderItem(id: number): ItemWithAddons {
    return {
      id: id,
      name: "Placeholder",
      description: "Describe Me",
      menuId: 7,
      basePrice: 102400,
      addons: []
    }
  }

  const [checkoutItems, setCheckoutItems] = useState<ConfiguredItem[]>([]);

  function handleItemClick(item: ConfiguredItem) {
    const newCheckoutItems = checkoutItems.slice()
    newCheckoutItems.push(item)
    setCheckoutItems(newCheckoutItems);
  }

  return (
    <div className="grid flex-grow w-screen grid-cols-[3fr,1fr]">
      <div className="p-4px h-screen overflow-y-scroll">
        Hello New World
        <ItemsList items={[...currentMenu.items, placeholderItem(1000), placeholderItem(1001), placeholderItem(1002)]} handleItemClick={handleItemClick} />
      </div>
      <div className="bg-blue-600 h-screen overflow-y-auto">
        <CheckoutCart configuredItems={checkoutItems} />
      </div>
    </div>
  );
}
