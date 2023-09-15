"use client";
import { useAppDispatch } from "@/store";
import { removeNotification } from "@/store/slices/notificationSlice";
import { useEffect, useState } from "react";
import { FaXmark, FaCircleExclamation, FaCircleInfo, FaCircleCheck, FaCircleQuestion } from "react-icons/fa6";

export default function Notification(props : AppNotification) {
  const [exit, setExit] = useState(false);
  const [width, setWidth] = useState(0);
  const [intervalID, setIntervalID] = useState<NodeJS.Timer>();
  const dispatch = useAppDispatch();

  const handleStartTimer = () => {
    const id = setInterval(() => {
      setWidth(prev => {
        if (prev < 100) {
          return prev + 0.5;
        }

        clearInterval(id);
        return prev;
      });
    }, 20);

    setIntervalID(id);
  };

  const handlePauseTimer = () => {
    clearInterval(intervalID);
  };

  const handleCloseNotification = () => {
    handlePauseTimer();
    setExit(true);
    setTimeout(() => {
      dispatch(removeNotification(props.id));
    }, 400)
  };

  useEffect(() => {
    if (width === 100) {
      // Close notification
      handleCloseNotification()
    }
  }, [width])

  useEffect(() => {
    handleStartTimer();
  }, []);

  const notificationType = {
    "success": "bg-green-500",
    "error": "bg-red-500",
    "warning": "bg-orange-500",
    "normal": "bg-slate-500"
  }

  return (
    <div
      onMouseEnter={handlePauseTimer}
      onMouseLeave={handleStartTimer}
      className={`relative flex items-center gap-2 px-3 py-4 rounded w-max slide-in text-slate-100 ${notificationType[props.type]} ${exit ? "exit" : ""}`}
    >
      {props.type === "success" && <FaCircleCheck className="text-xl"/>}
      {props.type === "error" && <FaCircleExclamation className="text-xl"/>}
      {props.type === "warning" && <FaCircleInfo className="text-xl"/>}
      {props.type === "normal" && <FaCircleQuestion className="text-xl"/>}
      <p className="font-title font-bold text-slate-50">{props.content}</p>
      <div className={"h-1 bg-slate-200 opacity-60 absolute left-0 bottom-0"} style={{ width: `${width}%` }} />
      <FaXmark className="text-2xl cursor-pointer" onClick={handleCloseNotification} />
    </div>
  );
};