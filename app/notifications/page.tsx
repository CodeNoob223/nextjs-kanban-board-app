"use client";

import SNCard from "@/components/SNCard";
import { useAppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchSN, noNewSN } from "@/store/slices/serverNotifSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";

export default function Page(): JSX.Element {
  const sn = useAppSelector(state => state.serverNotif);
  const supabase = createClientComponentClient();  
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getNotifications = async () => {
      const {data: {session}} = await supabase.auth.getSession();

      if (session) {
        await dispatch(fetchSN(0));
      } else {
        window.location.replace("/auth/login");
      }
    }

    dispatch(noNewSN());
    getNotifications();

  }, [dispatch, supabase]);

  return <section className="flex flex-col gap-3 sm:p-4 px-1 py-3 w-full">
    {
      sn.data.length > 0 ?
        <>
          {sn.data.map(notif => {
            return <SNCard
              key={notif.notification_id}
              content={notif.content}
              created_at={notif.created_at}
              notification_id={notif.notification_id}
              profile_id={notif.profile_id}
              title={notif.title}
            />
          }
          )}
        </>
        : <p className="text-slate-900 p-2">Bạn đã đọc hết thông báo!</p>
    }
  </section>
}