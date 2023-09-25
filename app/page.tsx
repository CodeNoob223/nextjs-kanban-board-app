"use client";
import NewTask from "@/components/NewTask";
import { Separator, Spinner } from "@/components/Sidebar";
import TaskList from "@/components/TaskList";
import { useAppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchTodos } from "@/store/slices/todoSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { FaUser, FaUsers, FaPlus, FaBell } from "react-icons/fa";

export default function Home() {
  const user = useAppSelector(state => state.user);

  return (
    <>
      {
        (user !== null) ?
          <Todos />
          : <main className="p-2">
            <h1 className="text-4xl font-bold mb-3">Phần mềm quản lý công việc</h1>
            <Separator />
            <h2 className="text-xl font-medium my-3">Vui lòng đăng nhập trước khi sử dụng</h2>
            <Separator />
            <section className="flex flex-col gap-3 text-lg mt-3">
              <p>
                Nhấn vào <FaUser className="inline bg-primary" /> để xem công việc cá nhân
              </p>
              <p>
                Nhấn vào <FaBell className="inline bg-primary" /> để xem thông báo
              </p>
              <p>
                Nhấn vào <FaUsers className="inline bg-primary" /> để xem công việc nhóm
              </p>
              <p>
                Nhấn vào <FaPlus className="inline bg-primary" /> để thêm hoặc tạo nhóm
              </p>
            </section>
          </main>
      }
    </>
  )
}

function Todos() {
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
      <NewTask />
      <TaskList />
    </div>
  }
}
