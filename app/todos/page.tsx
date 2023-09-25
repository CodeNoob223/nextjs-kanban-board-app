"use client";
import NewTodo from "@/components/NewTask";
import ToDosList from "@/components/TaskList";
import { Database } from "@/lib/database.types";
import { useAppDispatch } from "@/store";
import { fetchTodos } from "@/store/slices/todoSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Metadata } from "next";
import { Spinner } from "@/components/Sidebar";
import { useAppSelector } from "@/store/hooks";

export const metadata: Metadata = {
  title: "Công việc",
  description: "Việc cá nhân của bạn"
}

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClientComponentClient<Database>();
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.user);
  useEffect(() => {
    if (!user) {
      window.location.replace("/");
      return;
    }
    const Init = async () => {
      await dispatch(fetchTodos(100));
      setIsLoading(false);
    };

    Init();
  }, [supabase, dispatch, user]);

  if (isLoading) {
    return <Spinner />
  } else {
    return <div className="sm:p-5 p-2 flex flex-col gap-4 w-full">
      <NewTodo />
      <ToDosList />
    </div>
  }
}