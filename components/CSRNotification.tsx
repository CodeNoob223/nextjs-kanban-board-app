"use client";
import { useAppSelector } from "@/store/hooks";
import Notification from "./Notification";

export default function SSRNotification(): JSX.Element {
  const notifications = useAppSelector(state => state.notification);

  return <div className="fixed z-[11] top-10 right-5 flex flex-col gap-2">
    {notifications.map(notif => {
      return <Notification
        key={notif.id}
        id={notif.id}
        content={notif.content}
        type={notif.type}
      />
    })}
  </div>
}