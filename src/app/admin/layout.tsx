
function NavBar() {
  return (
    <nav className="
      flex
      flex-row
      justify-between
      h-50
      position-sticky
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
      <div>
        <button className="p-3 border-2 border-black box-border bg-white rounded-lg">Bye</button>
      </div>
    </nav>
  );
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex flex-col">
        <NavBar />
        {children}
      </div>
    </>
  );
}
