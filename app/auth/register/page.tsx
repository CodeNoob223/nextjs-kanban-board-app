"use client";
import { FaLock, FaEnvelope, FaUser, FaHashtag } from "react-icons/fa";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { useRouter } from "next/navigation";
import { addNotification } from "@/store/slices/notificationSlice";
import { useAppDispatch } from "@/store";
import Head from "next/head";

export default function RegisterPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [full_name, setFull_Name] = useState<string>("");
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const CheckLoggedIn = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.replace("/");
      }
    }

    CheckLoggedIn();
  }, [supabase.auth, router]);

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      await handleSignUp();
    }
  }

  const handleSignUp = async () => {
    if (username === "") {
      dispatch(addNotification({
        content: "Vui lòng nhập biệt danh!",
        type: "error"
      }));
      return;
    }

    if (username.length < 5) {
      dispatch(addNotification({
        content: "Biệt danh quá ngắn!",
        type: "error"
      }));
      return;
    }

    if (full_name === "") {
      dispatch(addNotification({
        content: "Vui lòng nhập họ và tên!",
        type: "error"
      }));
      return;
    }

    if (full_name.length < 10) {
      dispatch(addNotification({
        content: "Họ và tên quá ngắn!",
        type: "error"
      }));
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim().replaceAll(" ", ""),
          full_name: full_name,
          avatar_url: "https://picsum.photos/150/150?grayscale",
          role: "Member"
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
      phone: "1800678"
    });

    if (error) {
      localStorage.clear();
      dispatch(addNotification({
        content: error.message!,
        type: "error",
      }));
      return;
    }
    location.reload();
  }

  return (
    <div onKeyDown={handleKeyDown} className="absolute flex flex-col 
    gap-3 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] 
    sm:w-max w-[90%] 
    h-max 
    lg:p-10 sm:p-6 p-4 
    bg-slate-50 shadow-lg shadow-slate-400 rounded-lg overflow-hidden">
      <Head>
        <title>Đăng ký</title>
      </Head>
      <input name="csrfToken" type="hidden" defaultValue={"qjlrqlkwjeljkqwejklqweklj"} />
      <div className="text-2xl font-header font-bold text-slate-950 mx-auto mb-4">Đăng ký</div>

      <div className="flex h-max w-full max-w-[400px] mx-auto border-slate-400 border-solid border-2 rounded overflow-hidden">
        <div className="flex items-center bg-slate-200 border-r-2 border-slate-400 border-solid py-2 px-3">
          <FaEnvelope className="text-lg" />
        </div>
        <input
          id="email"
          className="py-2 px-3 outline-none w-[40vw]"
          type="text"
          name="email"
          placeholder="yourmail@email.com"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>

      <div className="flex h-max w-full max-w-[400px] mx-auto border-slate-400 border-solid border-2 rounded overflow-hidden mb-2">
        <div className="flex items-center bg-slate-200 border-r-2 border-slate-400 border-solid py-2 px-3">
          <FaLock className="text-lg" />
        </div>
        <input
          id="password"
          className="py-2 px-3 outline-none w-[40vw]"
          type="password"
          name="password"
          placeholder="******************"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div className="flex h-max w-full max-w-[400px] mx-auto border-slate-400 border-solid border-2 rounded overflow-hidden mb-2">
        <div className="flex items-center bg-slate-200 border-r-2 border-slate-400 border-solid py-2 px-3">
          <FaHashtag className="text-lg" />
        </div>
        <input
          id="username"
          className="py-2 px-3 outline-none w-[40vw]"
          type="username"
          name="username"
          placeholder="Biệt danh"
          autoComplete="off"
          onChange={(e) => setUserName(e.target.value)}
          value={username}
        />
      </div>

      <div className="flex h-max w-full max-w-[400px] mx-auto border-slate-400 border-solid border-2 rounded overflow-hidden mb-2">
        <div className="flex items-center bg-slate-200 border-r-2 border-slate-400 border-solid py-2 px-3">
          <FaUser className="text-lg" />
        </div>
        <input
          id="full_name"
          className="py-2 px-3 outline-none w-[40vw]"
          type="full_name"
          name="full_name"
          placeholder="Họ tên"
          autoComplete="off"
          onChange={(e) => setFull_Name(e.target.value)}
          value={full_name}
        />
      </div>

      <button type="button" onClick={handleSignUp} className="py-2 max-w-[400px] mx-auto px-4 bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
        <div className="flex gap-2 items-center w-max mx-auto">
          <FaEnvelope /> Đăng ký
        </div>
      </button>
      <p className="text-center">Đã có tài khoản? <a href="/auth/login" className="underline hover:text-primary cursor-pointer">Đăng nhập</a></p>
    </div >
  )
}