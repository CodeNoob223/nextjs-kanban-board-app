"use client";
import { MyLabel } from "@/components/NewTask";
import ReportCard from "@/components/ReportCard";
import SearchForm from "@/components/SearchForm";
import { Database } from "@/lib/database.types";
import { useAppDispatch } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { addNotification } from "@/store/slices/notificationSlice";
import { deleteReport, fetchReports, filterReport, getNewReport, postReport, putReport } from "@/store/slices/reportSlice";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPaperPlane, FaPlus, FaSave } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export default function Page(): JSX.Element {
  const searchParams = useSearchParams();
  const reportData = useAppSelector(state => state.reports);
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [projectId, setProjectId] = useState<number>(parseInt(searchParams.get("project") || "0"));
  const supabase = createClientComponentClient<Database>();
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [searchDate, setSearchDate] = useState<string>("");
  const [reportId, setReportId] = useState<number>(-1);
  const [edit, setEdit] = useState<{
    allow: boolean,
    flag: "post" | "put"
  }>({
    allow: false,
    flag: "post"
  });
  const [receiver, setReceiver] = useState<{
    username: string,
    profile_id: string
  }>({
    username: "",
    profile_id: ""
  });
  const [time, setTime] = useState<string>(new Date(Date.now()).toLocaleDateString());
  const [author, setAuthor] = useState<{
    username: string,
    profile_id: string
  }>({
    username: "",
    profile_id: ""
  });

  useEffect(() => {
    const channel = supabase.channel("project-messages")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "reports",
        filter: `project_id=eq.${projectId}`
      }, async (payload) => {
        if (payload.table === "reports") {
          if (payload.eventType !== "DELETE") {
            await dispatch(getNewReport(payload.new.report_id));
          } else if (payload.eventType === "DELETE") {
            dispatch(filterReport(payload.old.report_id));
          }
        }
      }).subscribe();

    const getReports = async () => {
      if (projectId !== 0)
        await dispatch(fetchReports(projectId));
    }

    getReports();

    return () => {
      channel.unsubscribe();
    }
  }, [projectId, dispatch, supabase]);

  useEffect(() => {
    if (user && edit.allow && edit.flag === "post") {
      setAuthor({
        username: user.username!,
        profile_id: user.profile_id
      });
      setReceiver(user.projects.find(project => project.project_id === projectId)?.team_lead!)
    }
  }, [user?.projects, user, edit, projectId]);

  const uploadReport = async () => {
    if (projectId === 0) {
      dispatch(addNotification({
        content: "Vui lòng chọn dự án!",
        type: "error"
      }));
      return;
    }

    if (!title) {
      dispatch(addNotification({
        content: "Vui lòng nhập tiêu đề!",
        type: "error"
      }));
      return;
    }

    if (!content) {
      dispatch(addNotification({
        content: "Vui lòng nhập nội dung!",
        type: "error"
      }));
      return;
    }

    if (content.length < 10) {
      dispatch(addNotification({
        content: "Nội dung quá ngắn!",
        type: "error"
      }));
      return;
    }

    if (title.length < 4) {
      dispatch(addNotification({
        content: "Tiêu đề quá ngắn!",
        type: "error"
      }));
      return;
    }

    setEdit({
      allow: false,
      flag: "post"
    });

    const res = await dispatch(postReport({
      content,
      title,
      project_id: projectId
    }));

    if (res.meta.requestStatus === "rejected") return console.log(res);
  }

  const removeReport = (report_id: number) => {
    dispatch(deleteReport(report_id));
  }

  const updateReport = async () => {
    await dispatch(putReport({
      report_id: reportId,
      content,
      title
    }));

    setEdit({
      allow: false,
      flag: "post"
    });
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value !== "0") {
      setProjectId(parseInt(event.target.value));
    }
  }

  const handleClick = (title: string, content: string, created_at: string, receiver: {
    username: string,
    profile_id: string
  }, author: {
    username: string,
    profile_id: string
  }, flag: {
    allow: boolean,
    flag: "post" | "put"
  }, report_id: number) => {
    setTitle(title);
    setContent(content);
    setTime(created_at);
    setReceiver(receiver);
    setAuthor(author);
    setEdit(flag);
    setReportId(report_id)
  }

  return <div className="sm:p-4 p-2 w-full h-full">
    <div className="flex gap-2 items-center mb-3">
      <div className="flex gap-2 items-center">
        <MyLabel content="Dự án: " for="project-list" />
        {
          user && user.projects &&
          <select
            id="project-list"
            className="p-2 rounded bg-slate-50 border-slate-950 border-[2px] border-solid"
            name="project-id"
            onChange={handleChange}
            value={projectId}
          >
            <option value={0}>Chọn dự án</option>
            {user && user?.projects.map(project => {
              return <option key={project.project_id} value={project.project_id}>{project.project_name}</option>
            })}
          </select>
        }
      </div>
      <button onClick={() => {
        if (projectId < 1) {
          dispatch(addNotification({
            content: "Vui lòng chọn dự án!",
            type: "error"
          }));
          return;
        }
        setTime(new Date(Date.now()).toLocaleDateString());
        setReportId(-1);
        setEdit({
          allow: true,
          flag: "post"
        })
      }} className="flex items-center flex-wrap gap-2 text-slate-50 p-2 bg-green-500 hover:bg-green-400 rounded sm:mx-2 mx-1">
        <p className="sm:block hidden">Thêm</p>
        <FaPlus className="text-xl flex-shrink-0" />
      </button>
    </div>

    <section className="relative flex flex-wrap sm:gap-4 gap-2 w-full h-full rounded">
      <form onSubmit={e => {
        e.preventDefault();
      }}
        className="relative flex flex-col flex-shrink-0 bg-slate-50 gap-2 sm:px-10 py-20 px-2  sm:w-[600px] w-[80vw] shadow-xl border-[2px] border-solid border-slate-300"
      >
        {reportId > 0 && <p className="absolute w-max rounded top-6 p-2 sm:text-sm text-xs bg-slate-950 text-primary">Mã: {reportId}</p>}
        {edit.allow && edit.flag === "post" ?
          <div className="flex gap-2 absolute top-6 sm:right-10 right-2">
            <button onClick={() => {
              uploadReport();
            }} className="flex w-max items-center gap-2 text-slate-50 p-2 bg-blue-600 hover:bg-blue-500 rounded">
              <FaPaperPlane className="text-lg flex-shrink-0" />
            </button>
            <button onClick={() => {
              setReportId(-1);
              setEdit({
                allow: false,
                flag: "post"
              });
            }} className="flex w-max items-center gap-2 text-slate-50 p-2 bg-red-600 hover:bg-red-500 rounded">
              <FaXmark className="text-lg flex-shrink-0" />
            </button>
          </div>
          : <></>
        }

        {edit.allow && edit.flag === "put" ?
          <div className="flex gap-2 absolute top-6 sm:right-10 right-2">
            <button onClick={() => {
              updateReport();
            }} className="flex w-max items-center gap-2 text-slate-50 p-2 bg-blue-600 hover:bg-blue-500 rounded">
              <FaSave className="text-lg flex-shrink-0" />
            </button>
            <button onClick={() => {
              setReportId(-1);
              setEdit({
                allow: false,
                flag: "post"
              });
            }} className="flex w-max items-center gap-2 text-slate-50 p-2 bg-red-600 hover:bg-red-500 rounded">
              <FaXmark className="text-lg flex-shrink-0" />
            </button>
          </div>
          : <></>
        }
        <input className="text-center bg-transparent hover:bg-slate-200 mx-auto font-bold sm:text-2xl text-xl mb-10 placeholder:text-slate-500 placeholder:italic"
          placeholder="Báo cáo..." value={title}
          readOnly={!edit.allow}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="flex gap-2">
          <p className="font-bold">Ngày: </p>
          <input type="text" name="time" id="time" className="bg-transparent hover:bg-slate-200 placeholder:text-slate-500 italic"
            value={time} readOnly={true}
          />
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Gửi trưởng dự án: </p>
          <a href={`profile/${receiver.profile_id}`} target="_blank" className="italic">{receiver.username}</a>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold">Nội dung: </p>
          <textarea name="content" id="content"
            className="p-1 bg-transparent whitespace-pre-wrap hover:bg-slate-200 resize-none w-full placeholder:text-slate-500 placeholder:italic"
            rows={10}
            spellCheck={false}
            placeholder={`Tôi đã hoàn thành...
            - Việc A: 50%
            - Việc B: Xong
            - Việc C: 0%
            `}
            value={content}
            onChange={e => setContent(e.target.value)}
            readOnly={!edit.allow}
          ></textarea>
        </div>
        {user &&
          <div className="flex flex-col gap-2 ml-auto text-center w-max">
            <p className="font-bold">Người gửi</p>
            <a href={`profile/${author.profile_id}`} target="_blank" className="italic">{author.username}</a>
          </div>
        }
      </form>
      <div className="h-[80vh] sm:w-[40%] w-full bg-slate-200 sm:p-4 p-2 flex-shrink rounded flex flex-col gap-2 overflow-hidden overflow-y-auto custom-sb">
        <SearchForm
          placeholder="Tiêu đề"
          deadlineInput={false}
          search={search}
          searchDate={searchDate}
          setSearch={(str: string) => setSearch(str)}
          setSearchDate={(str: string) => setSearchDate(str)}
        />
        {
          user && reportData.reports && reportData.reports.map((report, index) => {
            if (report.profiles && report.projects && report.title.includes(search)) {
              if (searchDate) {
                let searchStr = new Date(searchDate).getFullYear().toString() + "-" + new Date(searchDate).getMonth().toString();
                let reportDate = new Date(report.created_at).getFullYear().toString() + "-" + new Date(report.created_at).getMonth().toString();

                if (searchStr !== reportDate) return;
              }
              return <ReportCard
                content={report.content}
                created_at={report.created_at}
                handleView={handleClick}
                user_profile_id={user.profile_id}
                handleDelete={() => {
                  removeReport(report.report_id)
                }}
                handleEdit={handleClick}
                profiles={report.profiles}
                projects={report.projects}
                report_id={report.report_id}
                title={report.title}
                key={report.report_id}
              />
            }
          })
        }
      </div>
    </section>
  </div>
}