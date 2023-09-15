"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {FaBars} from "react-icons/fa";

export default function Navbar(): JSX.Element {
  const user = useAppSelector(state => state.user);
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    window.location.replace("/");
  }

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return <nav className="fixed z-10 px-[24px] py-[12px] bg-slate-950 shadow-md flex items-center w-full">
      <a href={"/"} className="mx-auto w-[80px] h-[24px] relative">
        <Image alt="logo" src={"/images/logo_text_white.png"} fill />
      </a>
    </nav>
  } else {
    return <nav className="fixed z-10 px-[24px] py-[12px] bg-slate-950 shadow-md flex items-center w-full">
      <FaBars className="text-slate-50 mr-4 text-xl cursor-pointer hover:text-primary" />
      <a href={"/"} className="mr-auto w-[80px] h-[24px] relative">
        <Image alt="logo" src={"/images/logo_text_white.png"} fill />
      </a>
      <div className="flex gap-4">
        <a href="todos">
          <p className="text-slate-200 transition-colors hover:text-primary font-title">Todos</p>
        </a>
        {user ?
          <>
            <p className="text-slate-200 font-title font-bold">Chào, {user.username}</p>
            <button onClick={handleSignOut}>
              <p className="text-slate-200 transition-colors hover:text-primary font-title">Đăng xuất</p>
            </button>
          </> :
          <a href="/auth/login">
            <p className="text-slate-200 transition-colors hover:text-primary font-title">Đăng nhập</p>
          </a>
        }
      </div>
    </nav>
  }
}