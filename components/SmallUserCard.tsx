"use client";
import { FaUserMinus } from "react-icons/fa";
import SmallUserAvatar from "./SmallUserAvatar"
import { useAppDispatch } from "@/store/hooks";
import { deleteProjectMember } from "@/store/slices/projectSlice";

export default function SmallUserCard({
  className = "",
  project_id = 0,
  kickAble = false,
  username,
  avatar_url,
  profile_id
} : {
  className?: string,
  username: string,
  profile_id: string,
  avatar_url: string,
  project_id?: number,
  kickAble?: boolean
}): JSX.Element {
  const dispatch = useAppDispatch();

  return <article className={`flex gap-2 items-center shadow-md rounded py-1 px-2 ${className || ""}`}>
    <SmallUserAvatar url={avatar_url} />
    <a href={`/profile/${profile_id}`}
      className="hover:text-primary"
      target="_blank"
    >{username}</a>
    { kickAble &&
      <FaUserMinus className="text-xl text-slate-500 hover:text-red-600 cursor-pointer"
        onClick={() => {
          dispatch(deleteProjectMember({
            profile_id: profile_id,
            project_id: project_id,
            flag: "leave"
          }));
        }}
      />
    }
  </article>
}