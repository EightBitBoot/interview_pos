import type { Addon, ItemWithAddons } from "~/server/db/schemas/posSchema";

import { z } from "zod";

// TODO(Adin): Convert these to transaction items
export type CheckoutAddon = {
  quantity: number,
} & Addon

export type ConfiguredItem = {
  item: ItemWithAddons,
  addons: CheckoutAddon[],
};

export function getConfItemPrice(item: ConfiguredItem) {
  return (
    item.item.basePrice +

    item.addons.reduce<number>((addonAcc, addon) => {
      return addonAcc + addon.quantity + addon.price;
    }, 0)
  );
}


