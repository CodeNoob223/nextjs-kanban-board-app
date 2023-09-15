import "../app/globals.css";

export default function Layout({children} : {children : React.ReactNode}) {
  return <div className="font-body bg-slate-50 w-full h-[100vh]">
    {children}
  </div>
}