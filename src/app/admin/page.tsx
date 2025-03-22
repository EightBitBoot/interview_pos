
import { api } from '~/trpc/server';

import AdminItemsList from './_components/adminItemsList';

export default async function AdminPage() {
  const allRestaurants = await api.admin.getRestaurants()

  return (
    <div>
      {
        <AdminItemsList menu={allRestaurants[0]!.menus[0]!} />
      }
    </div>
  );
}
