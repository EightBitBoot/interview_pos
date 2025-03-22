'use client';

import { useState } from 'react';

import Modal from 'react-modal'

import Card from '~/app/components/card';

import type { MenuWithItemsAndAddons, ItemWithAddons, RestaurantWithEverything } from '~/server/db/schemas/posSchema';
import AdminMenuEditor from './adminMenuEditor';

const emptyMenu: MenuWithItemsAndAddons = {
  id: -1,
  restaurantId: -1,
  name: "",
  items: [],
}

function AdminMenuCard({ menu, onClick }: { menu: MenuWithItemsAndAddons, onClick: (menu: MenuWithItemsAndAddons) => void }) {
  return (
    <Card key={menu.id} extraClasses="p-50 text-center p-10" onClick={() => onClick(menu)}>
      <div className="text-xl font-bold">
        {menu.name}
      </div>
    </Card>
  );
}

export default function AdminMenusList({ restaurant }: { restaurant: RestaurantWithEverything }) {
  const [currentMenu, setCurrentMenu] = useState<MenuWithItemsAndAddons | null>(null);

  function handleMenuClick(menu: MenuWithItemsAndAddons) {
    setCurrentMenu(menu);
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-3 p-3">
      {
        restaurant.menus.map((menu) => {
          return (
            <AdminMenuCard key={menu.id} menu={menu} onClick={handleMenuClick} />
          );
        })
      }
      </div>

      <Modal
        isOpen={currentMenu != null}
        onRequestClose={() => setCurrentMenu(null)}
      >
        <AdminMenuEditor menu={currentMenu ?? emptyMenu} />
      </Modal>
    </>
  );
}
