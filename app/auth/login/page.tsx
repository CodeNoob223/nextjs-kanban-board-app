"use client";
import { FaGoogle, FaGithub, FaLock, FaEnvelope, FaHourglass } from "react-icons/fa";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClientComponentClient<Database>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    console.log("Login useEffect run");
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
      await handleSignIn();
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      dispatch(addNotification({
        content: error.message!,
        type: "error",
      }));
      return;
    }

    localStorage.clear();
    location.replace("/");
  }

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${location.origin}/auth/callback`
      }
    });

    if (error) {
      dispatch(addNotification({
        content: error.message!,
        type: "error",
      }));
      return;
    }
  }

  const githubSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        queryParams: {
          prompt: 'consent'
        },
        redirectTo: `${location.origin}/auth/callback`
      }
    });

    if (error) {
      dispatch(addNotification({
        content: error.message!,
        type: "error",
      }));
      return;
    }
  }

  return (
    <div onKeyDown={handleKeyDown} className="absolute flex flex-col 
    gap-3 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] 
    sm:w-max w-[90%] 
    h-max 
    lg:p-10 sm:p-6 p-4 
    bg-slate-50 shadow-lg shadow-slate-400 rounded-lg overflow-hidden">
      <input name="csrfToken" type="hidden" defaultValue={"qjlrqlkwjeljkqwejklqweklj"} />
      <div className="text-2xl font-header font-bold text-slate-950 mx-auto mb-4">Đăng nhập</div>

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
        />
      </div>

      <div
        className="flex h-max w-full max-w-[400px] mx-auto border-slate-400 border-solid border-2 rounded overflow-hidden mb-2"
      >
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
        />
      </div>

      {
        isLoading ?
          <button type="button" className="py-2 px-4 max-w-[400px] mx-auto bg-slate-950 rounded overflow-hidden w-full text-slate-100 cursor-wait">
            <div className="flex gap-2 items-center w-max mx-auto">
              <FaHourglass /> Đang tải
            </div>
          </button>
          :
          <button type="button" onClick={handleSignIn} className="py-2 px-4 max-w-[400px] mx-auto bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
            <div className="flex gap-2 items-center w-max mx-auto">
              <FaEnvelope /> Đăng nhập
            </div>
          </button>
      }

      <p className="text-center">Tạo tài khoản? <a href="/auth/register" className="underline hover:text-primary cursor-pointer">Đăng ký</a></p>

      <div className="relative text-slate-400 mt-1 w-full max-w-[400px] mx-auto">
        <div className="absolute top-[45%] h-[2px] text-center bg-slate-400 w-full"></div>
        <p className="relative bg-slate-50 w-max h-max mx-auto px-2">Hoặc</p>
      </div>

      <div className="flex flex-col gap-2">
        <button type="button" onClick={googleSignIn} className="py-2 px-4 max-w-[400px] mx-auto bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
          <div className="flex gap-2 items-center w-max mx-auto">
            <FaGoogle /> Tiếp tục bằng Google
          </div>
        </button>
        <button type="button" onClick={githubSignIn} className="py-2 px-4 max-w-[400px] mx-auto bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
          <div className="flex gap-2 items-center w-max mx-auto">
            <FaGithub /> Tiếp tục bằng Github
          </div>
        </button>
      </div>
    </div >
  )
}