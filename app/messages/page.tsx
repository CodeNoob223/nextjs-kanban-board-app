"use client";
import { MyLabel } from "@/components/NewTask";
import ProjectMessageCard from "@/components/ProjectMessageCard";
import { Database } from "@/lib/database.types";
import { useAppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { addChatMessage, fetchMessages, getNewMessage, postMessage } from "@/store/slices/messageSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function Page(): JSX.Element {
  const chatData = useAppSelector(state => state.chatMessage);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [projectId, setProjectId] = useState<number>(0);
  const supabase = createClientComponentClient<Database>();
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const channel = supabase.channel("project-messages")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `project_id=eq.${projectId}`
      }, async (payload) => {
        if (payload.table === "messages") {
          await dispatch(getNewMessage(payload.new.message_id));
        }
      }).subscribe();

    const getMessages = async () => {
      if (projectId !== 0)
        await dispatch(fetchMessages(projectId));
    }

    getMessages();

    return () => {
      channel.unsubscribe();
    }
  }, [projectId, dispatch, supabase]);

  const sendMessage = async () => {
    if (projectId === 0) {
      dispatch(addNotification({
        content: "Vui lòng chọn dự án!",
        type: "warning"
      }));
      return;
    }

    if (content) {
      await dispatch(postMessage({
        content: content,
        project_id: projectId
      }));

      setContent(prev => "");
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value !== "0") {
      setProjectId(parseInt(event.target.value));
    }
  }

  return <div className="sm:p-4 p-2 w-full h-full">
    <MyLabel content="Dự án: " for="project-list" />
    {
      user && user.projects &&
      <select
        id="project-list"
        className="p-2 rounded bg-slate-50 border-slate-950 border-[2px] border-solid mb-3"
        name="project-id"
        onChange={handleChange}
        defaultValue={0}
      >
        <option value={0}>Chọn dự án</option>
        {user && user?.projects.map(project => {
          return <option key={project.project_id} value={project.project_id}>{project.project_name}</option>
        })}
      </select>
    }

    <section className="relative p-2 bg-slate-200 flex flex-col sm:gap-4 gap-2 w-full h-[80vh] rounded">
      <div className="flex flex-col p-2 gap-2 rounded-sm w-full h-[90%] flex-shrink overflow-y-auto custom-sb">
        {chatData.project_id !== 0 && chatData.messages.length > 0 ? chatData.messages.map(message => {
          if (message.profiles) {
            return <ProjectMessageCard
              key={message.message_id}
              content={message.content}
              created_at={message.created_at}
              message_id={message.message_id}
              own={message.profiles.profile_id === user?.profile_id}
              profiles={message.profiles}
              project_id={message.project_id}
            />
          }
        }) : <p className="w-max mx-auto">Hãy là người đầu tiên gửi tin nhắn!</p>}
      </div>
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage();
      }}
        className="flex items-center flex-shrink-0 gap-2 sm:px-4 px-2 w-full"
      >
        <input type="submit" hidden />
        <textarea
          id="message"
          name="message"
          onChange={(e) => {
            setContent(e.target.value);
          }}
          autoComplete="off"
          className="w-full mr-auto p-2 rounded-md resize-none h-max"
          value={content}
        ></textarea>
        <button type="submit" className="p-2 sm:mx-2 mx-1">
          <FaPaperPlane className="text-2xl text-blue-600 cursor-pointer hover:text-blue-500 flex-shrink-0" />
        </button>
      </form>
    </section>
  </div>
}