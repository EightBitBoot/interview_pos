'use client';

import { useState } from 'react';

import Modal from 'react-modal'

import Card from '~/app/components/card';

import {emptyItem} from '~/server/db/schemas/posSchema'
import type { MenuWithItemsAndAddons, ItemWithAddons } from '~/server/db/schemas/posSchema';
import AdminEditItemForm from './editItemForm';

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

      {/*
        TODO(Adin): Figure out how to set the App property
                    on ReactModal instead of just opting
                    out
      */}
      <Modal
        isOpen={currentItem != null}
        onRequestClose={() => setCurrentItem(null)}
        ariaHideApp={false}
      >
        <AdminEditItemForm item={currentItem ?? emptyItem} />
      </Modal>
    </>
  );
}
