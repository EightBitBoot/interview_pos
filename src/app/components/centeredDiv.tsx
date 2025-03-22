
import type { ReactNode } from 'react';

export default function CenteredDiv({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-row justify-center">
        {children}
      </div>
    </div>
  );
}

