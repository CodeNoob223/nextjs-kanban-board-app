"use client";
type ButtonProp = {
  type: "button" | "submit" | "reset" | undefined,
  children: React.ReactNode,
  handleClick: () => void
}

export default function BigButton({type, children, handleClick} : ButtonProp): JSX.Element {
  return (
    <button type={type} onClick={handleClick} className="py-2 px-4 bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
      <div className="flex gap-2 items-center w-max mx-auto">
        {children}
      </div>
    </button>
  );
}