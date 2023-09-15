"use client";
import { useState } from "react";
import { useAppDispatch } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";
import { useRouter } from "next/navigation";
import { addTodos, postTodo } from "@/store/slices/todoSlice";

export default function NewTodo() {
  const [task, setTask] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const addTodo = async (formData: FormData) => {
  //   'use server';
  //   const task = formData.get("task");

  //   const supabase = createServerActionClient({cookies});
  //   const {error} = await supabase.from("todos").insert
  //   ({
  //     task: task?.toString(),
  //     is_complete: "Pending"
  //   });

  //   if (error) {
  //     console.log(error);
  //     store.dispatch(addNotification({
  //       content: error.message!,
  //       type: "error"
  //     }));
  //   }

  //   revalidatePath('/todos');
  // }

  //Switch to client
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task === "") {
      return dispatch(addNotification({
        content: "Không được bỏ trống!",
        type: "error"
      }));
    }
    
    const res = await dispatch(postTodo({task: task}));
    if (res.meta.requestStatus === "fulfilled") {
      setTask(prev => "");
    } else {
      console.log(res);
    }
  }

  return (
    <form onSubmit={(e) => addTodo(e)} className="h-max w-max">
      <input
        type="text"
        name="task"
        id="task"
        className="h-full w-[300px] py-2 px-3 mr-4 text-base border-[3px] border-solid border-slate-950 rounded-md"
        value={task}
        onChange={(e) => {
          setTask(e.target.value)
        }}
        autoComplete="off"
      />
      <button type="submit" className="py-2 px-3 bg-slate-950 text-slate-50 hover:bg-primary hover:text-slate-950 rounded-md mr-3">Thêm</button>
    </form>
  );
}