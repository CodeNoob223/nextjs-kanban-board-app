"use client";
import { useState } from "react";
import { useAppDispatch } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";
import { addTodos, postTodo } from "@/store/slices/todoSlice";

export function MyInput(props: {
  type: React.HTMLInputTypeAttribute,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  name: string
  id: string
  placeholder?: string,
  value: string | any
}): JSX.Element {
  return <input
    type={props.type}
    name={props.name}
    id={props.id}
    className="sm:h-[40px] 
    max-w-[300px] w-[60vw] 
    sm:py-2 sm:px-3 
    py-1 px-2
    border-[3px] border-solid border-slate-950 rounded-md
    sm:text-base text-sm 
    outline-none
    "
    value={props.value}
    onChange={props.onChange}
    autoComplete="off"
    placeholder={props.placeholder || ""}
  />
}

export function MyLabel(props: {
  for: string,
  content: string
}): JSX.Element {
  return <label className="font-bold flex-shrink-0 sm:text-base text-sm" htmlFor={props.for}>{props.content}</label>
}

export default function NewTask() {
  const [task, setTask] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const dispatch = useAppDispatch();

  //Switch to client
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task === "") {
      return dispatch(addNotification({
        content: "Không được bỏ trống!",
        type: "error"
      }));
    }

    const res = await dispatch(postTodo({ task, deadline }));
    if (res.meta.requestStatus === "fulfilled") {
      setTask(prev => "");
    } else {
      console.log(res);
    }
  }

  return (
    <form onSubmit={(e) => addTodo(e)} className="flex flex-row flex-wrap gap-3 h-max w-full">
      <div className="flex gap-2 items-center">
        <MyLabel for="task" content="Nội dung: " />
        <MyInput
          type="text"
          name="task"
          id="task"
          value={task}
          onChange={(e) => {
            setTask(e.target.value)
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
      <button type="submit" 
      className="py-2 px-3 bg-slate-950 text-slate-50 hover:bg-primary hover:text-slate-950 rounded-md sm:w-max w-full sm:text-base text-sm">
        Thêm
      </button>
    </form>
  );
}