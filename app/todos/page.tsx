"use client";
import NewTodo from "@/components/NewTodo";
import ToDosList from "@/components/ToDoList";
import { Database } from "@/lib/database.types";
import { useAppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchTodos } from "@/store/slices/todoSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const offlineData = [
  {
    id: 12,
    task: 'Just wanna pour it',
    is_complete: 'Working',
    inserted_at: '2023-09-05T03:11:30.260592+00:00',
    profiles: { username: 'MQgamer' }
  },
  {
    id: 11,
    task: 'Finish Do An Chuyen Nganh',
    is_complete: 'Pending',
    inserted_at: '2023-09-04T15:25:00.854054+00:00',
    profiles: { username: 'MQgamer' }
  },
  {
    id: 13,
    task: 'Finish kaban board',
    is_complete: 'Pending',
    inserted_at: '2023-09-06T09:59:24.329966+00:00',
    profiles: { username: 'MQgamer' }
  }
] as ToDo[];

export default function Todos() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClientComponentClient<Database>();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector(state => state.user);

  if (!user) window.location.replace("/auth/login");

  useEffect(() => {
    const Init = async () => {
      await dispatch(fetchTodos(100));
      setIsLoading(false);
    };

    Init();
  }, [supabase, dispatch, router]);

  if (isLoading) {
    return <h1>Loading...</h1>
  } else {
    return <div className="p-5 flex flex-col gap-4">
      <NewTodo />
      <ToDosList />
    </div>
  }
}