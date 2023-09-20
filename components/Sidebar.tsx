"use client";
import { usePathname } from "next/navigation";
import { FaHome, FaUser, FaUsers, FaPlus, FaBell, FaBars, FaCircleNotch, FaTrashAlt } from "react-icons/fa";
import { FaUserMinus, FaMessage } from "react-icons/fa6"
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useAppDispatch } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";
import { useAppSelector } from "@/store/hooks";
import { MyInput, MyLabel } from "./NewTask";

export function Separator(): JSX.Element {
  return <div className="w-[100%] h-[1px] bg-slate-600"></div>
}

export default function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expand, setExpand] = useState<boolean>(false);
  const [addTeam, setAddTeam] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    const getTeams = async () => {
      const res = await fetch("http://localhost:3000/projects/api", {
        method: "get"
      });

      const { data, error }: GetSupaBaseRes<Project> = await res.json();

      if (error) {
        dispatch(addNotification({
          content: error,
          type: "error"
        }));
        setIsLoading(false);
        return;
      }
      setProjects(data);
      setIsLoading(false);
    };

    if (user) {
      getTeams();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, user]);

  const postNewProject = async () => {
    if (!projectId && !projectName) {
      dispatch(addNotification({
        content: "Nhập ít nhất 1 thông tin!",
        type: "error"
      }));
      return;
    }

    setAddTeam(false);

    const res = await fetch("http://localhost:3000/projects/api", {
      method: "post",
      body: JSON.stringify({
        project_id: projectId || "",
        project_name: projectName || ""
      })
    });

    const { data, error }: PostSupaBaseRes<Project> = await res.json();

    if (error) {
      dispatch(addNotification({
        content: error,
        type: "error"
      }));
      return;
    }

    setProjects(prev => [...prev, data]);
    if (projectId && projectName) {
      dispatch(addNotification({
        content: "Đã gia nhập dự án " + data.project_name,
        type: "success"
      }));
    } else if (projectName && !projectId) {
      dispatch(addNotification({
        content: "Đã tạo dự án " + data.project_name,
        type: "success"
      }));
    }
  };

  const removeTeam = async (flag: "leave" | "delete", project_id: number) => {
    const res = await fetch(`http://localhost:3000/projects/api?flag=${flag}&id=${project_id}`, {
      method: "delete"
    });

    const { id, error }: DeleteSupaBaseRes = await res.json();

    if (error) {
      dispatch(addNotification({
        content: error,
        type: "error"
      }));
      return;
    }

    setProjects(prev => prev.filter(project => project.project_name !== id.toString()));

    if (flag === "delete") {
      dispatch(addNotification({
        content: "Đã xóa dự án " + id, //id - sẽ mang giá trị project_name
        type: "success"
      }));
    } else {
      dispatch(addNotification({
        content: "Đã rời khỏi dự án " + id, //id - sẽ mang giá trị project_name
        type: "success"
      }));
    }
  }

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return <></>
  } else {
    return <>
      <div className={`${expand ? "w-max min-w-[200px] max-w-[300px]" : "w-[60px]"} transition-all flex-shrink-0`}></div>
      <div className={`fixed top-0 left-0 z-10 bg-slate-950 ${expand ? "w-max min-w-[200px] max-w-[300px]" : "w-[60px]"} transition-all h-[100vh] flex flex-col gap-2 p-[10px]`}>
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
        {
          pathname === "/todos" ?
            <Link href="/todos" className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaUser className="text-lg mx-3 flex-shrink-0 text-slate-950" />
              <p className="font-bold">Cá nhân</p>
            </Link>
            : <Link href="/todos" className="w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaUser className="text-lg mx-3 flex-shrink-0" />
              <p className="font-bold">Cá nhân</p>
            </Link>
        }
        <Separator />
        {
          pathname === "/notifications" ?
            <Link href="/notifications" className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaBell className="text-xl mx-[10px] flex-shrink-0 text-slate-950" />
              <p className="font-bold">Thông báo</p>
            </Link>
            : <Link href="/notifications" className="relative w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaBell className="text-xl mx-[10px] flex-shrink-0" />
              <p className="font-bold">Thông báo</p>
              <span className="absolute top-[6px] right-[6px] flex h-[10px] w-[10px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-primary"></span>
              </span>
            </Link>
        }
        {
          pathname === "/messages" ?
            <Link href="/messages" className="relative w-full h-[40px] overflow-hidden bg-primary rounded flex items-center">
              <FaMessage className="text-lg mx-[11px] flex-shrink-0 text-slate-950" />
              <p className="font-bold">Thông báo</p>
            </Link>
            : <Link href="/messages" className="relative w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950">
              <FaMessage className="text-lg mx-[11px] flex-shrink-0" />
              <p className="font-bold">Thông báo</p>
              <span className="absolute top-[6px] right-[6px] flex h-[10px] w-[10px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-primary"></span>
              </span>
            </Link>
        }
        <Separator />
        {isLoading ?
          <Spinner />
          : projects.map(project => {
            return (
              <Link href={"/projects/" + project.project_id} key={project.project_id}
                className={`overflow-x-hidden relative w-full h-[40px] overflow-hidden ${pathname === "/projects/" + project.project_id ? "bg-primary text-slate-950" : "bg-slate-950 text-slate-400"} hover:bg-primary hover:text-slate-950 rounded flex items-center`}>
                <FaUsers className="text-2xl mx-2 flex-shrink-0" />
                <p className="font-bold">{project.project_name}</p>
                {
                  user?.username === project.team_lead ?
                    <FaTrashAlt className="text-lg ml-auto mr-2 hover:text-red-600 flex-shrink-0 cursor-crosshair"
                      onClick={() => {
                        removeTeam("delete", project.project_id)
                      }}
                    />
                    : <FaUserMinus className="text-lg ml-auto mr-2 hover:text-red-600 flex-shrink-0 cursor-crosshair"
                      onClick={() => {
                        removeTeam("leave", project.project_id)
                      }}
                    />
                }
              </Link>
            )
          })
        }
        <button className="w-full h-[40px] overflow-hidden bg-slate-950 hover:bg-primary rounded flex items-center text-slate-400 hover:text-slate-950" onClick={() => setAddTeam(true)}>
          <FaPlus className="text-2xl mx-2 flex-shrink-0" />
          <p className="font-bold">Thêm nhóm</p>
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
              <div className="flex gap-3 items-center">
                <MyLabel
                  content="Mã"
                  for="teamId"
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
  return <div className="relative w-full h-[40px] overflow-hidden flex items-center cursor-progress">
    <FaCircleNotch className="text-2xl text-slate-500 mx-2 flex-shrink-0 animate-spin" />
    <p className="font-bold">Đang tải dữ liệu</p>
  </div>
}