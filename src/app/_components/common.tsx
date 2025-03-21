'use client';

import type { ReactNode } from 'react';

import clsx from 'clsx';

import type { Addon, ItemWithAddons } from "~/server/db/schemas/posSchema";

// TODO(Adin): Convert these to transaction items
export type CheckoutAddon = {
  quantity: number,
} & Addon

export type ConfiguredItem = {
  item: ItemWithAddons,
  addons: CheckoutAddon[],
};

export type ItemClickHandler = (item: ConfiguredItem) => void;
export type CheckoutHandler = () => void;

export function getConfItemPrice(item: ConfiguredItem) {
  return (
    item.item.basePrice +

    item.addons.reduce<number>((addonAcc, addon) => {
      return addonAcc + addon.quantity + addon.price;
    }, 0)
  );
}

export interface CardProps {
  padding?: number,
  textAlign?: string,
  gap?: number,
  onClick?: () => void,
  children: Readonly<ReactNode>,
};

export function Card({ padding = 50, gap = 3, textAlign, onClick, children }: CardProps) {
  return (
    <button
      className={clsx(
        `flex
         flex-col
         border-2
         border-black
         box-border
         bg-white
         rounded-xl
         drop-shadow-lg
         p-${padding}
         gap-${gap}`,

        (textAlign ? "text-" + textAlign : "text-left")
      )}

      onClick={(onClick ? onClick : () => { })}
    >
      {children}
    </button>
  )
}

