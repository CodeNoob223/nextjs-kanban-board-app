"use client";
import { MyInput, MyLabel } from "@/components/NewTask";
import { Spinner } from "@/components/Sidebar";
import SmallUserAvatar from "@/components/SmallUserAvatar";
import SmallUserCard from "@/components/SmallUserCard";
import Button from "@/components/buttons/Button";
import ProjectNewTask from "@/components/projectsComp/ProjectNewTask";
import ProjectTaskList from "@/components/projectsComp/ProjectTaskList";
import { Database } from "@/lib/database.types";
import { useAppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";
import { deleteOwnProject, deleteProjectMember, fetchNewProjectMember, fetchNewTaskData, fetchProjectData, filterProjectMember, filterProjectTask, removeTaskMember } from "@/store/slices/projectSlice";
import { filterUserProjectList, putProject } from "@/store/slices/userDataSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Metadata } from "next";
import { useEffect, useState } from "react";
import { FaPen, FaSave, FaTrash, FaUserMinus } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";

export default function Page({ params }: {
  params: {
    slug: string
  }
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const project = useAppSelector(state => state.project);
  const userData = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const supabase = createClientComponentClient<Database>();

  const [edit, setEdit] = useState<{
    show: boolean,
    project_name: string,
    description: string
  }>({
    show: false,
    project_name: project.project_name,
    description: project.description
  });

  useEffect(() => {
    const channel = supabase.channel("project-tasks")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "tasks",
        filter: `project_id=eq.${parseInt(params.slug)}`
      }, async (payload) => {
        if (payload.eventType !== "DELETE") {
          const res = await dispatch(fetchNewTaskData(payload.new.task_id as number));

          if (res.meta.requestStatus === "rejected") console.log(res);

        } else if (payload.eventType === "DELETE") {
          dispatch(filterProjectTask(payload.old.task_id as number));
        }
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "profile_task"
      }, async (payload) => {
        if (payload.eventType === "INSERT") {
          const res = await dispatch(fetchNewTaskData(payload.new.task_id as number));

          if (res.meta.requestStatus === "rejected") console.log(res);
        } else if (payload.eventType === "DELETE") {
          dispatch(removeTaskMember({
            profile_id: payload.old.profile_id,
            task_id: payload.old.task_id
          }));
        }
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "profile_project",
        filter: `project_id=eq.${parseInt(params.slug)}`
      }, async (payload) => {
        if (payload.eventType === "INSERT") {
          dispatch(addNotification({
            content: "Có người tham gia dự án",
            type: "success"
          }));
          await dispatch(fetchNewProjectMember({
            profile_id: payload.new.profile_id,
            project_id: payload.new.project_id,
          }));
        } else if (payload.eventType === "DELETE") {
          //Lọc thành viên khỏi UI
          dispatch(filterProjectMember(payload.old.id));

          if (userData?.profile_id === project.project_members.find(member => member.id === payload.old.id)?.profiles.profile_id) {
            dispatch(addNotification({
              content: "Bạn đã bị xóa khỏi dự án!",
              type: "error"
            }));
            setTimeout(() => {
              window.location.replace("/");
            }, 3000)
            return;
          }
        }
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "projects",
        filter: `project_id=eq.${parseInt(params.slug)}`
      }, async (payload) => {
        console.log(payload);
        if (payload.eventType === "DELETE" && payload.table === "projects") {
          if (payload.old.project_id === params.slug) {
            dispatch(addNotification({
              content: "Dự án đã bị xóa!",
              type: "error"
            }));
            setTimeout(() => {
              window.location.replace("/");
            }, 3000)
          }
        } else if (payload.eventType === "UPDATE") {
          dispatch(fetchProjectData(payload.new.project_id));
        }
      })
      .subscribe();

    const getData = async () => {
      const user = await supabase.auth.getUser();
      if (user.error) {
        window.location.replace("/auth/login");
        return;
      }

      if (project.project_id !== -1 && project.project_id === parseInt(params.slug)) {
        setIsLoading(false);
        return;
      }

      const res = await dispatch(fetchProjectData(parseInt(params.slug)));

      if (res.meta.requestStatus === "rejected") {
        console.log(res);
        dispatch(filterUserProjectList(parseInt(params.slug)));
        return;
      }

      setIsLoading(false);
    };
    getData();

    return () => {
      channel.unsubscribe();
    }
  }, [params, dispatch, supabase, project]);

  const updateProject = async () => {
    setEdit(prev => ({ ...prev, show: false }));

    const res = await dispatch(putProject({
      project_id: parseInt(params.slug),
      description: edit.description,
      project_name: edit.project_name
    }))

    if (res.meta.requestStatus === "rejected") console.log(res);
  };

  return <div className="p-4">
    {
      isLoading ?
        <Spinner />
        : userData && <>
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex gap-2 flex-wrap items-center">
              <h1 className="sm:text-2xl text-xl font-bold">Dự án {project.project_name}</h1>
              <span className="py-1 px-2 rounded bg-slate-950 text-primary">Mã: {project.project_id}</span>

              {
                userData.profile_id === project.team_lead.profile_id &&
                <>

                  <Button
                    handleClick={(e) => {
                      if (confirm("Xóa dự án?!")) {
                        dispatch(deleteOwnProject({
                          profile_id: userData.profile_id,
                          project_id: parseInt(params.slug)
                        }));
                      }
                    }}
                    type="button"
                    className="flex gap-2 items-center bg-red-600 hover:bg-red-500 text-slate-50"
                  >
                    <FaTrash className="sm:text-lg text-xs" />
                  </Button>
                  <Button
                    handleClick={(e) => {
                      setEdit(prev => (
                        {
                          show: true,
                          project_name: project.project_name,
                          description: project.description
                        }
                      ))
                    }}
                    type="button"
                    className="flex gap-2 items-center bg-blue-600 hover:bg-blue-500 text-slate-50"
                  >
                    <FaPen className="sm:text-lg text-xs" />
                  </Button>
                </>
              }
            </div>
            <p><span className="font-bold">Mô tả: </span>{project.description || "Không có mô tả"}</p>
            <div className="flex gap-2 items-center">
              <p className="font-bold">Manager:</p>
              <SmallUserCard
                avatar_url={project.team_lead.avatar_url}
                profile_id={project.team_lead.profile_id}
                username={project.team_lead.username}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <p className="font-bold">Thành viên:</p>
              {
                project.project_members.map(member => {
                  if (member.profiles)
                    return <SmallUserCard
                      key={member.profiles.profile_id}
                      avatar_url={member.profiles.avatar_url}
                      username={member.profiles.username}
                      profile_id={member.profiles.profile_id}
                      kickAble={userData?.profile_id === project.team_lead.profile_id && member.profiles.profile_id !== userData?.profile_id}
                      project_id={parseInt(params.slug)}
                    />
                })
              }
            </div>
          </div>
          {
            edit.show &&
            <section className="fixed z-20 top-0 left-0 w-[100vw] h-[100vh] bg-slate-950/[.5]"
              onClick={(e) => {
                setEdit(prev => ({ ...prev, show: false }));
              }}
            >
              <form className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:w-full w-[90vw] max-w-[400px] sm:p-10 p-4 flex flex-col gap-3 bg-slate-100 shadow-xl rounded-md"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEdit(prev => ({ ...prev, show: false }));
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  updateProject();
                }}
              >
                <h1 className="text-xl w-max mx-auto font-bold">Dự án</h1>
                <div className="flex gap-3 items-center">
                  <MyLabel
                    content="Mã: "
                    for="project_id"
                  />
                  <MyInput
                    id="project_id"
                    name="project_id"
                    onChange={() => { }}
                    type="text"
                    value={project.project_id}
                    readOnly={true}
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <MyLabel
                    content="Tên: "
                    for="project_name"
                  />
                  <MyInput
                    id="project_name"
                    name="project_name"
                    type="text"
                    value={edit.project_name}
                    placeholder="Tên dự án"
                    onChange={(e) => {
                      setEdit(prev => ({ ...prev, project_name: e.target.value }));
                    }}
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <MyLabel
                    content="Mô tả: "
                    for="description"
                  />
                  <MyInput
                    id="description"
                    name="description"
                    type="text"
                    value={edit.description}
                    placeholder="Thông tin mô tả"
                    onChange={(e) => {
                      setEdit(prev => ({ ...prev, description: e.target.value }));
                    }}
                  />
                </div>
                <button type="submit"
                  className="py-2 max-w-[400px] mx-auto px-4 bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
                  <div className="flex gap-2 items-center w-max mx-auto">
                    <FaSave /> Lưu sửa đổi
                  </div>
                </button>
                <button type="button"
                  onClick={() => {
                    setEdit({
                      show: false,
                      project_name: project.project_name,
                      description: project.description
                    });
                  }}
                  className="py-2 max-w-[400px] mx-auto px-4 bg-red-600 hover:bg-red-500 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
                  <div className="flex gap-2 items-center w-max mx-auto">
                    <FaArrowRightFromBracket /> Hủy sửa đổi
                  </div>
                </button>
              </form>
            </section>
          }
          <ProjectNewTask project_id={parseInt(params.slug)} />
          <ProjectTaskList tasks={project.tasks} user={userData!} />
        </>
    }
  </div>
}