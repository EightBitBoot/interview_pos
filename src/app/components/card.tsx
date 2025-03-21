'use client';

import type { ReactNode } from 'react';

import clsx from 'clsx';

export interface CardProps {
  padding?: number,
  textAlign?: string,
  gap?: number,
  onClick?: () => void,
  children: Readonly<ReactNode>,
};

export function Card({ padding = 50, gap = 3, textAlign, onClick, children }: CardProps) {
  if (onClick) {
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

        onClick={() => onClick()}
      >
        {children}
      </button>
    )
  }
  else {
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
      >
        {children}
      </button>
    )
  }
}
