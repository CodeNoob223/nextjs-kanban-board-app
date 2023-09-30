"use client";

import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import SmallUserAvatar from "./SmallUserAvatar";

interface ReportCardTypes extends ProjectReport {
  handleView: (title: string, content: string, created_at: string, receiver: {
    username: string,
    profile_id: string
  }, author: {
    username: string,
    profile_id: string
  }, flag: {
    allow: boolean,
    flag: "post" | "put"
  }, report_id: number) => void,
  handleDelete: () => void,
  handleEdit: (title: string, content: string, created_at: string, receiver: {
    username: string,
    profile_id: string
  }, author: {
    username: string,
    profile_id: string
  }, flag: {
    allow: boolean,
    flag: "post" | "put"
  }, report_id: number) => void,
  user_profile_id: string
}

export default function ReportCard(props: ReportCardTypes): JSX.Element {

  return <article className="bg-slate-100 shadow-lg rounded p-4 flex items-center">
    <div className="mr-auto">
      <h1 className="font-bold text-xl mb-3">{props.title}</h1>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 text-sm">
          <p className="font-bold flex-shrink-0">Thời gian:</p>
          <p>{new Date(props.created_at).toUTCString()}</p>
        </div>
        <div className="flex gap-2 text-sm">
          <p className="font-bold flex-shrink-0">Người gửi:</p>
          <div className="flex gap-2 items-center">
            <SmallUserAvatar url={props.profiles.avatar_url} />
            <a href={`profile/${props.profiles.profile_id}`} target="_blank">{props.profiles.username}</a>
          </div>
        </div>
        <div className="flex gap-2 text-sm">
          <p className="font-bold flex-shrink-0">Nội dung:</p>
          <p className="h-max max-h-[60px] overflow-hidden w-full">{props.content}</p>
        </div>
      </div>
    </div>
    <div className="flex flex-col items-center gap-2">
      <button onClick={() => {
        props.handleView(props.title, props.content, new Date(props.created_at).toLocaleDateString(), {
          username: props.projects.team_lead.username,
          profile_id: props.projects.team_lead.profile_id
        }, {
          username: props.profiles.username,
          profile_id: props.profiles.profile_id
        }, {
          allow: false,
          flag: "post"
        }, props.report_id);
      }} className="flex items-center text-slate-50 p-2 bg-blue-600 hover:bg-blue-500 rounded sm:mx-2 mx-1">
        <FaEye className="text-lg flex-shrink-0" />
      </button>

      {props.user_profile_id === props.profiles.profile_id || props.user_profile_id === props.projects.team_lead.profile_id
        ? <button onClick={() => {
          props.handleDelete();
        }} className="flex items-center text-slate-50 p-2 bg-red-600 hover:bg-red-500 rounded sm:mx-2 mx-1">
          <FaTrash className="text-lg flex-shrink-0" />
        </button> : <></>
      }

      {props.user_profile_id === props.profiles.profile_id || props.user_profile_id === props.projects.team_lead.profile_id
        ? <button onClick={() => {
          props.handleEdit(props.title, props.content, new Date(props.created_at).toLocaleDateString(), {
            username: props.projects.team_lead.username,
            profile_id: props.projects.team_lead.profile_id
          }, {
            username: props.profiles.username,
            profile_id: props.profiles.profile_id
          }, {
            allow: true,
            flag: "put"
          }, props.report_id);
        }} className="flex items-center text-slate-50 p-2 bg-orange-600 hover:bg-orange-500 rounded sm:mx-2 mx-1">
          <FaEdit className="text-lg flex-shrink-0" />
        </button> : <></>
      }
    </div>
  </article>
}