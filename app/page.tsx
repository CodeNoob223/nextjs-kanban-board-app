"use client";
import { store } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";
import {useState} from "react";

export default function Home() {
  const [content, setContent] = useState<string>("");
  return (
    <main className="absolute top-52 flex min-h-screen bg-slate-50 flex-col items-center">
      <input type="text" className="border border-solid border-black"
        onChange={e => setContent(e.target.value)}
      />
      <button onClick={() => {
        store.dispatch(addNotification({
          content,
          type: "success"
        }))
      }}>Add</button>
    </main>
  )
}
