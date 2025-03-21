import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

import { db } from "~/server/db";

import PosDisplay from "~/app/_components/posDisplay";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  // Avoid naming conflict with restaurants schema
  const eateries = await db.query.restaurants.findMany({
    with: {
      menus: {
        with: {
          items: true
        }
      }
    }
  })

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  const items = eateries.map((eatery) => {
    <div>Test</div>
  })

  return (
    <HydrateClient>
      <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] overflow-y-hidden">
        <p>Current Restaurant</p>
        <select name="currentRestaurant">
          {
            eateries.map((eatery) => {
              return <option key={eatery.id} value={eatery.name.toLowerCase()}>{eatery.name}</option>
            })
          }
        </select>
        <PosDisplay currentMenu={eateries[0]!.menus[0]!}/>
      </main>
    </HydrateClient>
  );
}
