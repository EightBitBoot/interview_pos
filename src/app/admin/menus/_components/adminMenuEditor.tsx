import { MenuWithItemsAndAddons } from '~/server/db/schemas/posSchema';
import AdminItemsList from './adminItemsList';

export default function AdminMenuEditor({ menu, onClick }: { menu: MenuWithItemsAndAddons, onClick?: (menu: MenuWithItemsAndAddons) => void}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-bold text-3xl text-center border-b-black pb-2 border-b-2">{menu.name}</h1>
      <div className="flex-grow pt-2">
        <AdminItemsList menu={menu} />
      </div>
    </div>
  );
}
