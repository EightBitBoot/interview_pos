'use client';

import type { ReactNode } from 'react';

import clsx from 'clsx';

export interface CardProps {
  extraClasses?: string,
  onClick?: () => void,
  children: Readonly<ReactNode>,
};

export default function Card({ extraClasses, onClick, children }: CardProps) {
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
         p-3
         gap-3
         text-left`,

         (extraClasses?? false),
      )}

      onClick={onClick ?? undefined}
    >
      {children}
    </button>
  )
}
