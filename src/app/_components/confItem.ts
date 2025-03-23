import { emptyItem, type Addon, type ItemWithAddons } from "~/server/db/schemas/posSchema";

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

export function getConfItemPrice(item: ConfiguredItem) {
  return (
    item.item.basePrice +

    item.addons.reduce<number>((addonAcc, addon) => {
      return addonAcc + addon.quantity + addon.price;
    }, 0)
  );
}

export function getTotalFromConfItems(configuredItems: ConfiguredItem[]) {
  return configuredItems.reduce((acc, item) => {
    return acc + item.item.basePrice + item.addons.reduce((acc, addon) => {
      return acc + addon.price;
    }, 0)
  }, 0)
}

export function itemToConfItem(item: ItemWithAddons): ConfiguredItem {
  return {
    item: item,
    addons: item.addons.map((addon) => {
      return {...addon, quantity: 0};
    })
  };
}
