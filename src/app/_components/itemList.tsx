// NOTE(Adin): Implicitly 'use client' under posDisplay.tsx

import { ItemWithAddons } from '~/server/db/schemas/posSchema';

import { Card } from '~/app/components/card';

import type { ConfiguredItem } from "./confItem";
import { formatCurrency } from "~/utils/uiUtils";

type ItemClickHandler = (item: ConfiguredItem) => void;

function ItemCard({ item, onItemClick }: { item: ItemWithAddons, onItemClick: ItemClickHandler }) {
  // TODO(Adin): Make this dynamic
  const configuredItem = {
    item: item,
    addons: [
      {
        id: item.id,
        itemId: item.id,
        name: "Ketchup",
        price: 73,
        quantity: 1,
      },

      {
        id: item.id * 1000,
        itemId: item.id,
        name: "Mayonaise",
        price: 83,
        quantity: 2,
      },
    ],
  };

  return (
    <Card
      extraClasses="p-10 text-center"
      onClick={() => onItemClick(configuredItem)}
    >
      <div className="font-semibold text-2xl">{item.name}</div>
      <div>{item.description}</div>
      <div className="min-h-3" />
      <div>${formatCurrency(item.basePrice)}</div>
    </Card>
  );
}

export default function ItemsList({ items, handleItemClick }: { items: ItemWithAddons[], handleItemClick: ItemClickHandler }) {
  return (
    <div className="grid grid-cols-4 gap-5 p-5">
      {
        items.map((item) => {
          return <ItemCard key={item.id} item={item} onItemClick={handleItemClick} />;
        })
      }
    </div>
  );
}

