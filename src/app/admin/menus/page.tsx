import AdminMenusList from "./_components/adminMenusList";

import { api } from "~/trpc/server";

export default async function MenusPage() {
  const [restaurant] = await api.admin.getRestaurants();

  return <AdminMenusList restaurant={restaurant!} />
}
