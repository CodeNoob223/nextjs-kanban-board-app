"use client";

import { useAppDispatch } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";

export default function ClientCompAdder() : JSX.Element {
  const dispatch = useAppDispatch() 

  return <button onClick={() => dispatch(addNotification({
    content: "test",
    type: "success"
  }))}>Add</button>
}