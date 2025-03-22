'use client';

import { useState } from 'react';

import { api } from '~/trpc/react';

import Card from './components/card';
import CenteredDiv from './components/centeredDiv'

import PosDisplay from './_components/posDisplay';

function LoadingDisplay() {
  return (
    <CenteredDiv>
      <Card>Loading</Card>
    </CenteredDiv>
  );
}

export default function Home() {
  const { isLoading, data } = api.admin.getRestaurants.useQuery()
  const restaurants = data ?? [];

  const [currentRestaurant, setCurrentRestaurant] = useState(0);

  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] overflow-y-hidden">
      {
        isLoading ? <LoadingDisplay /> :

          <>
            <label className="text-white">Current Restaurant</label>
            <select name="currentRestaurant" onChange={(e) => setCurrentRestaurant(e.target.selectedIndex)}>
              {
                restaurants.map((restaurant) => {
                  return <option key={restaurant.id} value={restaurant.name.toLowerCase()}>{restaurant.name}</option>
                })
              }

            </select>
            <PosDisplay currentMenu={restaurants[currentRestaurant]!.menus[0]!} />
          </>
      }
    </main>
  );
}
