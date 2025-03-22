'use client';

import { useState } from 'react';

import Modal from 'react-modal'

import Card from '~/app/components/card';

import type { MenuWithItemsAndAddons, ItemWithAddons } from '~/server/db/schemas/posSchema';
import AdminEditItemForm from './editItemForm';

const emptyItem: ItemWithAddons = {
  id: -1,
  menuId: -1,
  name: "",
  description: "",
  basePrice: 0,
  addons: [],
}

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
      <div className="grid grid-cols-4 gap-2">
        {
          menu.items.map((item) => {
            return (
              <AdminItemCard key={item.id} item={item} onClick={handleItemClick} />
            );
          })
        }
      </div>

      <Modal
        isOpen={currentItem != null}
        onRequestClose={() => setCurrentItem(null)}
      >
        {/*
            Note(Adin): This is safe to force coalesce because the modal won't
            open unless currentItem is set
        */}
        <AdminEditItemForm item={currentItem ?? emptyItem} />
      </Modal>
    </>
  );
}
