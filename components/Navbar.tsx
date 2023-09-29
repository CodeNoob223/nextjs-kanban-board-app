"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {FaSignOutAlt} from "react-icons/fa";
import SmallUserAvatar from "./SmallUserAvatar";

export default function Navbar(): JSX.Element {
  const user = useAppSelector(state => state.user);
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();

    setTimeout(() => {
      window.location.replace("/");
    }, 300)
  }

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return <nav className="fixed z-10 px-[18px] h-[60px] py-[12px] bg-slate-950 shadow-md flex items-center w-full">
      <a href={"/"} className="mx-auto w-[80px] h-[24px] relative">
        <Image alt="logo" src={"/images/logo_text_white.png"} fill />
      </a>
    </nav>
  } else {
    return <nav className="fixed z-10 pl-[72px] pr-[12px] h-[60px] py-[12px] bg-slate-950 shadow-md flex items-center w-full">
      <a href={"/"} className="w-[80px] h-[24px] mr-auto relative">
        <Image alt="logo" src={"/images/logo_text_white.png"} fill />
      </a>
      <div className="flex gap-4 sm:text-base text-sm items-center">
        {user ?
          <div className="flex flex-row gap-2 items-center">
            <SmallUserAvatar url={user.avatar_url!} />
            <a href={`/profile/${user.profile_id}`} className="text-slate-200 font-title font-bold hover:text-primary">{user.username}</a>
            <button onClick={handleSignOut} className="text-slate-200 hover:text-primary">
              <FaSignOutAlt className=" sm:text-xl text-base"/>
            </button>
          </div> :
          <a href="/auth/login">
            <p className="text-slate-200 transition-colors hover:text-primary font-title">Đăng nhập</p>
          </a>
        }
      </div>
    </nav>
  }
}