import { emptyItem, type Addon, type ItemWithAddons } from "~/server/db/schemas/posSchema";
import { CheckoutItem } from "./posDisplay";

// TODO(Adin): Convert these to transaction items
export type CheckoutAddon = {
  quantity: number,
} & Addon

export type ConfiguredItem = {
  item: ItemWithAddons,
  addons: CheckoutAddon[],
};

export const emptyConfiguredItem = {
  item: emptyItem,
  addons: [],
}

// (item_id, [(addonId, quantity)])

export function getConfItemPrice(item: ConfiguredItem) {
  return (
    item.item.basePrice +

    item.addons.reduce<number>((addonAcc, addon) => {
      return addonAcc + (addon.price * addon.quantity);
    }, 0)
  );
}

export function getTotalFromConfItems(configuredItems: CheckoutItem[]) {
  return configuredItems.reduce((acc, item) => {
      return acc + getConfItemPrice(item.confItem) * item.quantity;
  }, 0);
}

export function itemToConfItem(item: ItemWithAddons): ConfiguredItem {
  return {
    item: item,
    addons: item.addons.map((addon) => {
      return {...addon, quantity: 0};
    })
  };
}

export function getConfItemId(item: ConfiguredItem) {
  return item.item.id.toString() + ": [" + item.addons.toSorted((a, b) => a.id - b.id).reduce((acc, addon) => {
    return acc + `(${addon.id}, ${addon.quantity}), `
  }, "") + "]";
}
