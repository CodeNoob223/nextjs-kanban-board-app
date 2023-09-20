"use client";
import { Spinner } from "@/components/Sidebar";
import { useAppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";
import { Metadata } from "next";
import { useEffect, useState } from "react";

export async function generateMetadata(
  { params }: {
    params: { slug: string }
  }
): Promise<Metadata> {
  return {
    title: "Nhóm " + params.slug
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      window.location.replace("/auth/login");
      return;
    }
    const getData = async () => {
      const res = await fetch(`http://localhost:3000/teams/${params.slug}/api?id=${params.slug}`, {
        method: "get"
      });

      const {data, error} : GetSupaBaseRes<Task> = await res.json();

      if (error) {
        dispatch(addNotification({
          content: error,
          type: "error"
        }));

        return;
      }

      setTasks(data);
      setIsLoading(false);
    };
    getData();
  }, [params]);

  return <div className="p-4">
    {
      isLoading ?
        <Spinner />
        : <>
          <div>My Post: {params.slug}</div>
        </>
    }
  </div>
}