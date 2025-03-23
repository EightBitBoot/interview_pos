// NOTE(Adin): Implicitly 'use client' under posDisplay.tsx

import Modal from 'react-modal';

import { ItemWithAddons } from '~/server/db/schemas/posSchema';

import Card from '~/app/components/card';

import { emptyConfiguredItem, getConfItemId, itemToConfItem, } from "./confItem";
import type {CheckoutAddon, ConfiguredItem } from './confItem'

import { formatCurrency } from "~/utils/uiUtils";
import { useState } from 'react';

type ItemAddHandler = (item: ConfiguredItem) => void;

function ItemCard({ item, onClick }: { item: ItemWithAddons, onClick: (item: ItemWithAddons) => void }) {
  return (
    <Card
      extraClasses="p-10 text-center"
      onClick={() => onClick(item)}
    >
      <div className="font-semibold text-2xl">{item.name}</div>
      <div>{item.description}</div>
      <div className="min-h-3" />
      <div>${formatCurrency(item.basePrice)}</div>
    </Card>
  );
}

type AddonEditRowProps = {
  addon: CheckoutAddon,
  addonIndex: number,
  onChangeQuantity: (change: number, index: number) => void
}

function AddonEditRow({ addon, addonIndex, onChangeQuantity }: AddonEditRowProps) {
  return (
    <li className="flex flex-row gap-3 p-3 border-black border-2 rounded-xl">
      <h1 className="font-bold text-l">{addon.name}</h1>

      <div className="flex flex-row gap-3">
        <button className="h-10 w-10 rounded-full bg-gray-200 text-center" onClick={() => onChangeQuantity(-1, addonIndex)}>-</button>
        <button className="h-10 w-10 rounded-full bg-gray-200 text-center" onClick={() => onChangeQuantity(1, addonIndex)}>+</button>
      </div>

      <div className="font-bold">Quantity: {addon.quantity}</div>
    </li>
  );
}

type ItemModalDisplayProps = {
  item: ConfiguredItem,
  onChangeQuantity: (change: number, index: number) => void,
  onAddToCart: () => void,
}

function ItemModalDisplay({ item, onChangeQuantity, onAddToCart }: ItemModalDisplayProps) {

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold">{item.item.name}</h1>
      <ul className="gap-1">
        {
          item.addons.map((addon, index) => {
            return <AddonEditRow key={addon.id} addon={addon} addonIndex={index} onChangeQuantity={onChangeQuantity} />
          })
        }
      </ul>

      <button className="absolute bottom-5 right-5 bg-gray-300 text-center font-bold p-5 rounded-xl" onClick={onAddToCart}><div className="static">Add To Cart</div></button>
    </div>
  );
}

type ItemsListProps = {
  items: ItemWithAddons[],
  onAddItem: (item: ConfiguredItem) => void,
};

export default function ItemsList({ items, onAddItem }: ItemsListProps) {
  const [currentItem, setCurrentItem] = useState<ConfiguredItem | null>(null);

  function selectItem(item: ItemWithAddons) {
    setCurrentItem(itemToConfItem(item));
  }

  function handleChangeQuantity(change: number, index: number) {
    if (!currentItem) {
      return
    }

    let newCurrentItem = { ...currentItem };
    const newQuantity = newCurrentItem.addons[index]!.quantity + change;
    newCurrentItem.addons[index]!.quantity = Math.max(newQuantity, 0)
    setCurrentItem(newCurrentItem);
  }

  function handleAddToCart() {
    if(!currentItem) {
      return;
    }

    onAddItem(item);
    setCurrentItem(null);
  }

  // TODO(Adin): Hacky work around: fix me
  let item = currentItem ?? emptyConfiguredItem;

  return (
    <>
      {/* TODO(Adin): Figure out how to set the App property on ReactModal instead of just opting out*/}
      <Modal isOpen={currentItem !== null} onRequestClose={() => setCurrentItem(null)} ariaHideApp={false}>
        <ItemModalDisplay item={item} onChangeQuantity={handleChangeQuantity} onAddToCart={handleAddToCart} />
      </Modal>

      <div id="main" className="grid grid-cols-4 gap-5 p-5">
        {
          items.map((item) => {
            return <ItemCard key={item.id} item={item} onClick={selectItem} />;
          })
        }
      </div>
    </>
  );
}

