"use client";
import { useState } from "react";
import { useAppDispatch } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";

import { MyInput, MyLabel } from "../NewTask";
import { postProjectTask } from "@/store/slices/projectSlice";

export default function ProjectNewTask({project_id} : {
  project_id: number
}) {
  const [content, setContent] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const dispatch = useAppDispatch();

  //Switch to client
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content === "") {
      return dispatch(addNotification({
        content: "Không được bỏ trống!",
        type: "error"
      }));
    }

    const res = await dispatch(postProjectTask({ project_id, content, deadline }));
    if (res.meta.requestStatus === "fulfilled") {
      setContent(prev => "");
    } else {
      console.log(res);
    }
  }

  return (
    <form onSubmit={(e) => addTodo(e)} className="flex flex-row flex-wrap gap-3 h-max w-full my-4">
      <div className="flex gap-2 items-center">
        <MyLabel for="content" content="Nội dung: " />
        <MyInput
          type="text"
          name="content"
          id="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
          }}
        />
      </div>
      <div className="flex gap-2 items-center">
        <MyLabel for="datetime" content="Hạn: " />
        <MyInput
          name="datetime"
          id="datetime"
          type="datetime-local"
          onChange={(e) => {
            setDeadline(e.target.value);
          }}
          value={deadline}
        />
      </div>
      <button type="submit" className="py-2 px-3 bg-slate-950 text-slate-50 hover:bg-primary hover:text-slate-950 rounded-md sm:w-max w-full sm:text-base text-sm">
        Thêm
      </button>
    </form>
  );
}