'use client';

import { useState } from 'react';

import Modal from 'react-modal'

import Card from '~/app/components/card';

import type { MenuWithItemsAndAddons, ItemWithAddons } from '~/server/db/schemas/posSchema';

function AdminItemCard({ item, onClick }: { item: ItemWithAddons, onClick: (item: ItemWithAddons) => void }) {
  return (
    <Card key={item.id} extraClasses="p-50" onClick={() => onClick(item)}>
      <div className="text-xl font-bold">
        {item.name}
      </div>
    </Card>
  );
}

export default function AdminItemsList({ menu }: { menu: MenuWithItemsAndAddons }) {
  const [currentItem, setCurrentItem] = useState<ItemWithAddons | null>(null);

  function handleItemClick(item: ItemWithAddons) {
    setCurrentItem(item);
  }

  return (
    <>
      {
        menu.items.map((item) => {
          return (
            <AdminItemCard key={item.id} item={item} onClick={handleItemClick} />
          );
        })
      }

      <Modal
        isOpen={currentItem != null}
        onRequestClose={() => setCurrentItem(null)}
      >
        I could really go for an {currentItem?.name ?? "Nothing Burger"}
      </Modal>
    </>
  );
}
