"use client";
import { usePathname } from "next/navigation";
import { FaHome, FaUser, FaUsers, FaPlus, FaBell, FaBars, FaCircleNotch, FaTrashAlt, FaFileInvoice, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import { FaUserMinus, FaMessage, FaArrowRightFromBracket } from "react-icons/fa6"
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useAppDispatch } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";
import { useAppSelector } from "@/store/hooks";
import { MyInput, MyLabel } from "./NewTask";
import { deleteProject, fetchProjects, filterUserProjectList, postProject } from "@/store/slices/userDataSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { addSN } from "@/store/slices/serverNotifSlice";
import { setNew } from "@/store/slices/messageSlice";

export function Separator(): JSX.Element {
  return <div className="w-[100%] h-[1px] bg-slate-600"></div>
}

export default function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expand, setExpand] = useState<boolean>(false);
  const [addTeam, setAddTeam] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const sn = useAppSelector(state => state.serverNotif);
  const messages = useAppSelector(state => state.chatMessage);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getProjects = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const data = await dispatch(fetchProjects(10)); // 10 is limit number

        if (data.meta.requestStatus === "rejected") {
          console.log(data);
          return
        };

      }
      setIsLoading(false);
    }
    getProjects();
  }, [dispatch, supabase]);

  useEffect(() => {
    const channel = supabase.channel("profile-projects")
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "projects"
      }, async (payload) => {
        dispatch(filterUserProjectList(payload.old.project_id));
      })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `profile_id=eq.${user?.profile_id}`
      }, async (payload) => {
        if (payload.table === "notifications") {
          dispatch(addSN(payload.new as ServerNotification));
        }
      })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, async (payload) => {
        if (payload.table === "messages") {
          if (user?.projects.find(project => project.project_id === payload.new.project_id))
            if (user.profile_id !== payload.new.profile_id)
              dispatch(setNew());
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    }
  }, [user?.profile_id, user?.projects, supabase, dispatch])

  const postNewProject = async () => {
    if (!projectId && !projectName) {
      dispatch(addNotification({
        content: "Nhập ít nhất 1 thông tin!",
        type: "error"
      }));
      return;
    }

    if (user!.projects.map(project => project.project_id).includes(parseInt(projectId))) {
      dispatch(addNotification({
        content: "Bạn đã tham gia rồi!",
        type: "error"
      }));
      return;
    }

    if (user!.projects.length >= 2) {
      dispatch(addNotification({
        content: "Quá số lượng cho phép!",
        type: "error"
      }));
      return;
    }

    setAddTeam(false);

    dispatch(postProject({
      project_id: projectId,
      project_name: projectName
    }));
  };

  const removeProject = async (flag: "leave" | "delete", project_id: number) => {
    if (user?.profile_id)
      dispatch(deleteProject({
        flag: flag,
        project_id: project_id,
        profile_id: user.profile_id
      }));
  }

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return <></>
  } else {
    return <>
      <div className={`${expand ? "sm:w-[200px]" : "sm:w-[60px] w-[48px]"} transition-all flex-shrink-0`}></div>
      <div className={`fixed top-0 left-0 z-10 bg-slate-950 ${expand ? "w-max min-w-[200px] max-w-[300px]" : "sm:w-[60px] w-[48px]"} transition-all h-[200vh] flex flex-col gap-2 sm:p-[10px] p-1`}>
        <button className="relative w-full h-[40px] overflow-hidden rounded mb-2">
          <FaBars className="text-slate-50 mx-auto text-xl cursor-pointer hover:text-primary"
            onClick={() => setExpand(prev => !prev)}
          />
        </button>
        {
          pathname === "/" || pathname === "" ?
            <Link href="/" className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaHome className="text-2xl mx-2 flex-shrink-0 text-slate-950" />
              <p className="font-bold">Trang chủ</p>
            </Link>
            : <Link href="/" className="w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaHome className="text-2xl mx-2 flex-shrink-0" />
              <p className="font-bold">Trang chủ</p>
            </Link>
        }
        {user &&
          (pathname === `/profile/${user?.profile_id}` ?
            <Link href={`/profile/${user?.profile_id}`} className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaUser className="text-lg mx-3 flex-shrink-0 text-slate-950" />
              <p className="font-bold">Hồ sơ</p>
            </Link>
            : <Link href={`/profile/${user?.profile_id}`} className="w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaUser className="text-lg mx-3 flex-shrink-0" />
              <p className="font-bold">Hồ sơ</p>
            </Link>)
        }
        <Separator />
        {
          pathname === "/notifications" ?
            <Link href="/notifications" className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaEnvelope className="text-xl mx-[10px] flex-shrink-0 text-slate-950" />
              <p className="font-bold">Thông báo</p>
            </Link>
            : <Link href="/notifications" className="relative w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaEnvelope className="text-xl mx-[10px] flex-shrink-0" />
              <p className="font-bold">Thông báo</p>
              {sn.new && <span className="absolute top-[6px] right-[6px] flex h-[10px] w-[10px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-primary"></span>
              </span>}
            </Link>
        }
        {
          pathname === "/messages" ?
            <Link href={`/messages?project=${user ? (user.projects.length > 0 ? user?.projects[0].project_id : 0) : 0}`} className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaMessage className="text-lg mx-[11px] flex-shrink-0 text-slate-950" />
              <p className="font-bold">Tin nhắn</p>
            </Link>
            : <Link href={`/messages?project=${user ? (user.projects.length > 0 ? user?.projects[0].project_id : 0) : 0}`} className="relative w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaMessage className="text-lg mx-[11px] flex-shrink-0" />
              <p className="font-bold">Tin nhắn</p>
              {messages.isNew && <span className="absolute top-[6px] right-[6px] flex h-[10px] w-[10px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-primary"></span>
              </span>}
            </Link>
        }
        <Separator />
        {
          pathname === "/reports" ?
            <Link href={`/reports?project=${user ? (user.projects.length > 0 ? user?.projects[0].project_id : 0) : 0}`}
              className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaFileInvoice className="text-2xl mx-[9px] flex-shrink-0 text-slate-950" />
              <p className="font-bold">Báo cáo</p>
            </Link>
            : <Link href={`/reports?project=${user ? (user.projects.length > 0 ? user?.projects[0].project_id : 0) : 0}`}
              className="relative w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaFileInvoice className="text-2xl mx-[9px] flex-shrink-0" />
              <p className="font-bold">Báo cáo</p>
            </Link>
        }
        <Separator />
        {
          pathname === "/tos" ?
            <Link href={`/tos`}
              className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaInfoCircle className="text-2xl mx-[9px] flex-shrink-0 text-slate-950" />
              <p className="font-bold">Điều khoản</p>
            </Link>
            : <Link href={`/tos`}
              className="relative w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaInfoCircle className="text-2xl mx-[9px] flex-shrink-0" />
              <p className="font-bold">Điều khoản</p>
            </Link>
        }
        <Separator />
        {isLoading ?
          <Spinner />
          : user && user.projects.map(project => {

            return (
              <div key={project.project_id}
                className={`overflow-x-hidden relative w-full h-[40px] overflow-hidden ${pathname === "/projects/" + project.project_id ? "bg-primary text-slate-950" : "bg-slate-950 text-slate-400"} hover:bg-primary hover:text-slate-950 rounded flex items-center`}
              >
                <Link href={"/projects/" + project.project_id} className="flex">
                  <FaUsers className="text-2xl mx-2 flex-shrink-0" />
                  <p className="font-bold whitespace-nowrap max-w-[120px] overflow-hidden">{project.project_name}</p>
                </Link>
                {
                  user?.profile_id === project.team_lead.profile_id ?
                    <FaTrashAlt className="text-lg ml-auto mr-2 hover:text-red-600 flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        if (confirm("Xóa dự án?")) {
                          removeProject("delete", project.project_id)
                        }
                      }}
                    />
                    : <FaUserMinus className="text-lg ml-auto mr-2 hover:text-red-600 flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        if (confirm("Rời khỏi dự án?")) {
                          removeProject("leave", project.project_id)
                        }
                      }}
                    />
                }
              </div>
            )
          })
        }
        <button className="w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950" onClick={() => setAddTeam(true)}>
          <FaPlus className="text-2xl mx-2 flex-shrink-0" />
          <p className="font-bold">Dự án mới</p>
        </button>

        {
          addTeam &&
          <section className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-slate-950/[.5]"
            onClick={(e) => {
              setAddTeam(false);
            }}
          >
            <form className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:w-full w-[90vw] max-w-[400px] sm:p-10 p-4 flex flex-col gap-3 bg-slate-100 shadow-xl rounded-md"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setAddTeam(false);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onSubmit={(e) => {
                e.preventDefault();
                postNewProject();
              }}
            >
              <h1 className="text-xl w-max mx-auto font-bold">Thêm dự án</h1>
              <div className="flex gap-3 items-center">
                <MyLabel
                  content="Mã"
                  for="projectId"
                />
                <MyInput
                  id="projectId"
                  name="projectId"
                  type="number"
                  value={projectId}
                  placeholder="Mã dự án"
                  onChange={(e) => {
                    setProjectId(e.target.value);
                  }}
                />
              </div>
              <div className="flex gap-3 items-center">
                <MyLabel
                  content="Tên"
                  for="projectName"
                />
                <MyInput
                  id="projectName"
                  name="projectName"
                  type="text"
                  value={projectName}
                  placeholder="Tên dự án"
                  onChange={(e) => {
                    setProjectName(e.target.value);
                  }}
                />
              </div>
              <button type="submit"
                className="py-2 max-w-[400px] mx-auto px-4 bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
                <div className="flex gap-2 items-center w-max mx-auto">
                  <FaPlus /> Thêm dự án
                </div>
              </button>
              <button type="button"
                onClick={() => setAddTeam(false)}
                className="py-2 max-w-[400px] mx-auto px-4 bg-red-600 hover:bg-red-500 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
                <div className="flex gap-2 items-center w-max mx-auto">
                  <FaArrowRightFromBracket /> Quay lại
                </div>
              </button>
              <div>
                <p className="text-orange-600">Bỏ trống mã để tạo dự án mới.</p>
                <p className="text-orange-600">Tên dự án phải độc nhất.</p>
              </div>
            </form>
          </section>
        }
      </div>
    </>
  }
}

export function Spinner(): JSX.Element {
  return <div className="relative w-full text-slate-500 h-[40px] overflow-hidden flex items-center cursor-progress">
    <FaCircleNotch className="text-2xl mx-2 flex-shrink-0 animate-spin" />
    <p className="font-bold">Đang tải dữ liệu</p>
  </div>
}