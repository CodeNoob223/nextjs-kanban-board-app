import { useAppDispatch } from "@/store/hooks";
import { deleteSN } from "@/store/slices/serverNotifSlice";
import { useState } from "react";
import { FaCheck, FaClock } from "react-icons/fa";

export default function SNCard(props: ServerNotification): JSX.Element {
  const dispatch = useAppDispatch();
  const [exit, setExit] = useState<boolean>(false);

  const markNotif = async () => {
    setExit(true);
    setTimeout(() => {
      dispatch(deleteSN(props.notification_id));
    }, 500)
  }

  return <article className="p-4 shadow-xl rounded bg-blue-600 text-slate-100 w-full max-w-[600px] flex gap-2 items-center"
    style={{
      transition: "all ease-in 0.5s",
      transform: `translateX(${exit ? "100vw" : "0px"})`
    }}
  >
    <div className="flex flex-col gap-2 mr-auto">
      <h1 className="text-xl font-bold">{props.title}</h1>
      <div className="flex gap-2 items-center text-xs">
        <FaClock /> 
        <p>
          {new Date(props.created_at).toDateString()}
        </p>
      </div>
      <p>{props.content}</p>
    </div>
    <div
      onClick={markNotif} 
      className="p-2 cursor-pointer text-primary hover:bg-primary hover:text-slate-950 rounded">
      <FaCheck />
    </div>
  </article>
}