"use client";

import { MyInput, MyLabel } from "@/components/NewTask";
import SNCard from "@/components/SNCard";
import SearchForm from "@/components/SearchForm";
import { useAppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { fetchSN, noNewSN } from "@/store/slices/serverNotifSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page(): JSX.Element {
  const sn = useAppSelector(state => state.serverNotif);
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");
  const supabase = createClientComponentClient();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getNotifications = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        await dispatch(fetchSN(0));
      } else {
        router.replace("/auth/login");
      }
    }

    dispatch(noNewSN());
    getNotifications();

  }, [dispatch, supabase, router]);

  return <section className="flex flex-col gap-3 sm:p-4 px-1 py-3 w-full transition-all duration-100 ease-in-out">
    <SearchForm 
      deadlineInput={false}
      search={search}
      searchDate={searchDate}
      setSearch={(str : string) => setSearch(str)}
      setSearchDate={(str : string) => setSearchDate(str)}
    />
    {
      sn.data.length > 0 ?
        <>
          {sn.data.map(notif => {
            if (notif.content.includes(search)) {
              if (searchDate) {
                let searchStr = new Date(searchDate).getFullYear().toString() + "-" + new Date(searchDate).getMonth().toString();
                let notifDate = new Date(notif.created_at).getFullYear().toString() + "-" + new Date(notif.created_at).getMonth().toString();

                if (searchStr !== notifDate) return;
              }
              return <SNCard
                key={notif.notification_id}
                content={notif.content}
                created_at={notif.created_at}
                notification_id={notif.notification_id}
                profile_id={notif.profile_id}
                title={notif.title}
              />
            }
          }
          )}
        </>
        : <p className="text-slate-900 p-2">Bạn đã đọc hết thông báo!</p>
    }
  </section>
}