'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation';

import clsx from 'clsx';

function NavBar() {
  const linkClasses = "rounded-md border-black border-2 p-2 hover:text-blue-600 hover:border-blue-600";

  const route = usePathname();

  return (
    <nav className="
      flex
      flex-row
      justify-between
      h-50
      sticky
      blue-50
      pl-10
      pr-10
      pt-5
      pb-5
      border-b-2
      border-radius-xl
    ">
      <div>
        <button className="p-3 border-2 border-black box-border bg-white rounded-lg">Hi</button>
      </div>
      <div className="flex flex-row gap-2">
        <Link className={clsx(linkClasses, {"text-blue-600 border-blue-600": route === "/admin/menus"})} href="/admin/menus">Menus</Link>
        <Link className={clsx(linkClasses, {"text-blue-600 border-blue-600": route === "/admin/transactions"})} href="/admin/transactions">Transaction History</Link>
        <Link className={clsx(linkClasses, {"text-blue-600 border-blue-600": route === "/admin/users"})} href="/admin/users">Users</Link>
      </div>
      <div>
        <button className="p-3 border-2 border-black box-border bg-white rounded-lg">Bye</button>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
