"use client";
import { BiTrash } from "react-icons/bi";
import { useAppDispatch } from "@/store";
import { Draggable } from "@hello-pangea/dnd";
import { FaCheck, FaEdit, FaLock, FaSave, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import { MyInput, MyLabel } from "../NewTask";
import SmallUserAvatar from "../SmallUserAvatar";
import { deleteProjectTask, deleteTaskMember, postTaskMember, putProjectTask } from "@/store/slices/projectSlice";
import { useAppSelector } from "@/store/hooks";
import { FaArrowRightFromBracket } from "react-icons/fa6";

interface TaskCardType extends Task {
  index: number,
  selfUnmount: (id: number, colName: Task["status"]) => void
}
export default function ProjectTaskCard(props: TaskCardType): JSX.Element {
  const dispatch = useAppDispatch();
  const { profile_id } = useAppSelector(state => state.user!);
  const [popUp, setPopUp] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>(props.progress.toString());
  const [status, setStatus] = useState<Task["status"]>(props.status);


  const markTodo = async () => {
    setPopUp(false);
    if (parseInt(progress) === props.progress && status === props.status) return;

    const res = await dispatch(putProjectTask({
      id: props.task_id,
      from: props.status,
      to: progress === "100" ? "Done" : status,
      fromIndex: props.index,
      toIndex: status !== props.status ? props.index : -1, //Hop to the end of the next column,
      progress: progress,
      workers: props.workers
    }));

    if (res.meta.requestStatus === "rejected") {
      // console.log(res);
    } else if (props.status !== status) {
      props.selfUnmount(props.task_id, props.status);
    }
  };

  const deleteTodo = async () => {
    if (confirm("Xóa công việc?")) {
      const res = await dispatch(deleteProjectTask(props.task_id));
  
      if (res.meta.requestStatus === "rejected") {
        console.log(res);
      } else {
        props.selfUnmount(props.task_id, props.status);
      }
    }
  }

  return <>
    <Draggable
      draggableId={props.task_id.toString()}
      index={props.index}
      isDragDisabled={props.progress === 100 || props.status === "Done"}
    >
      {
        (provided, snapshot) => (
          <div className={`p-4 flex-shrink-0 lg:w-[300px] w-full bg-slate-200 shadow-md rounded-md overflow-hidden m-0 ${snapshot.isDragging ? "opacity-70" : ""}`}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className="flex mb-2 items-center select-none">
              <p className="lg:p-2 p-1 flex items-center bg-slate-500 rounded mr-2 text-xs text-slate-50">id: {props.task_id}</p>

              {props.status === "Done" &&
                <p className={`lg:p-2 p-1 flex items-center bg-green-500 rounded w-max text-slate-50 text-xs`}>Done</p>
              }
              {props.status === "Pending" &&
                <p className={`lg:p-2 p-1 flex items-center bg-red-500 rounded w-max text-slate-50 text-xs`}>Pending</p>
              }
              {props.status === "Working" &&
                <p className={`lg:p-2 p-1 flex items-center bg-blue-500 rounded w-max text-slate-50 text-xs`}>Working</p>
              }

              <BiTrash className="lg:text-3xl text-2xl ml-auto mr-2 text-slate-400 hover:text-red-600 cursor-pointer" onClick={deleteTodo} />

              <FaEdit className="lg:text-2xl text-xl text-slate-400 hover:text-blue-600 cursor-pointer" onClick={() => setPopUp(true)} />
            </div>
            <p className="font lg:text-sm text-xs">Người đăng: {props.profiles?.username}</p>
            <p className="font lg:text-sm text-xs">Ngày đăng: {new Date(props.inserted_at).toDateString()}</p>
            <p className="font lg:text-sm text-xs"><span className="text-red-700 font-semibold">Hạn: </span>{props.deadline ? new Date(props.deadline).toDateString() : "None"}</p>
            <p className="lg:text-base text-sm">Nội dung: {props.content}</p>
            <div className="flex items-center gap-2">
              <p>{props.progress}%</p>
              <div className="h-[8px] w-[88%] overflow-hidden rounded-sm bg-slate-400">
                <div className={`h-full ${props.progress == 100 ? "bg-green-500" : ""} ${props.progress < 100 && props.progress > 49 ? "bg-orange-500" : ""} ${props.progress < 50 ? "bg-red-500" : ""}`}
                  style={{
                    width: `${props.progress}%`
                  }}></div>
              </div>
            </div>
            {
              props.workers!.length > 0 &&
              <section className="flex flex-col gap-1 mt-3">{props.workers?.map(worker => {
                if (worker.profiles) return <SmallUserAvatar key={worker.profiles.username} url={worker.profiles.avatar_url} />
              })}</section>
            }
          </div>
        )
      }
    </Draggable>
    {
      popUp &&
      <section className="fixed z-20 top-0 left-0 w-[100vw] h-[100vh] bg-slate-950/[.5]"
        onClick={(e) => {
          setPopUp(false);
        }}
      >
        <form className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:w-full w-[90vw] max-w-[400px] sm:p-10 p-4 flex flex-col gap-3 bg-slate-100 shadow-xl rounded-md"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setPopUp(false);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onSubmit={(e) => {
            e.preventDefault();
            markTodo();
          }}
        >
          <h1 className="text-xl w-max mx-auto font-bold">Công việc</h1>
          <div className="flex gap-3 items-center">
            <MyLabel
              content="Mã: "
              for="task_id"
            />
            <MyInput
              id="task_id"
              name="task_id"
              onChange={() => { }}
              type="text"
              value={props.task_id}
              readOnly={true}
            />
          </div>
          <div className="flex gap-3">
            <MyLabel
              content="Nội dung: "
              for="content"
            />
            <textarea name="content" id="content"
              className="sm:h-[40px] 
              max-w-[300px] w-[60vw] 
              sm:py-2 sm:px-3 
              py-1 px-2 min-h-[150px] h-max
              border-[3px] border-solid border-slate-950 rounded-md
              sm:text-base text-sm 
              outline-none resize-none"
              value={props.content!}
              readOnly
            >
            </textarea>
          </div>
          <div className="flex gap-3 items-center">
            <MyLabel
              content="Tiến độ: "
              for="progress"
            />
            <MyInput
              id="progress"
              name="progress"
              type="number"
              value={progress}
              placeholder="0 %"
              onChange={(e) => {
                setProgress(e.target.value);
              }}
            />
          </div>
          <div className="flex gap-3 items-center">
            <MyLabel
              content="Trạng thái: "
              for="status"
            />
            <select name="status" id="status"
              className="sm:h-[40px] 
              max-w-[300px] w-[60vw] 
              sm:py-2 sm:px-3 
              py-1 px-2
              border-[3px] border-solid border-slate-950 rounded-md
              sm:text-base text-sm 
              outline-none font-medium
              "
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
            >
              <option value="Pending">Đang chờ</option>
              <option value="Working">Đang làm</option>
              <option value="Done">Hoàn thành</option>
            </select>
          </div>
          <div className="flex gap-3 flex-col">
            <MyLabel
              content="Người làm: "
              for="workers"
            />
            {
              props.workers!.length > 0 ?
                <section id="workers">
                  <article className="flex flex-col gap-1">{props.workers?.map(worker => {
                    if (worker.profiles)
                      return <div className="flex gap-2 items-center"
                        key={worker.profiles.username}
                      >
                        <SmallUserAvatar url={worker.profiles.avatar_url} />
                        <p>{worker.profiles.username}</p>
                      </div>
                  })}</article>
                </section> : <p id="workers" className="-translate-y-2 text-red-600">Chưa có</p>
            }
          </div>
          {
            !props.workers.find(worker => worker.profiles.profile_id === profile_id) ?
              <button type="button" onClick={() => {
                dispatch(postTaskMember(props.task_id));
              }}
                className="py-2 max-w-[400px] mx-auto px-4 bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
                <div className="flex gap-2 items-center w-max mx-auto">
                  <FaUserPlus /> Tham gia
                </div>
              </button> :
              <button type="button" onClick={() => {
                dispatch(deleteTaskMember({
                  profile_id: profile_id,
                  task_id: props.task_id,
                  workersNum: props.workers.length
                }));
              }}
                className="py-2 max-w-[400px] mx-auto px-4 bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
                <div className="flex gap-2 items-center w-max mx-auto">
                  <FaUserMinus /> Hủy tham gia
                </div>
              </button>
          }
          {
            props.progress === 100 || !props.workers.find(worker => worker.profiles.profile_id === profile_id) ?
              <button type="button" disabled
                className="py-2 max-w-[400px] mx-auto px-4 bg-slate-500 cursor-not-allowed rounded overflow-hidden w-full text-slate-100">
                <div className="flex gap-2 items-center w-max mx-auto">
                  <FaLock /> Không thể sửa
                </div>
              </button> :
              <button type="submit"
                className="py-2 max-w-[400px] mx-auto px-4 bg-slate-950 hover:bg-primary hover:text-slate-950 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
                <div className="flex gap-2 items-center w-max mx-auto">
                  {props.status === "Pending" ?
                    <>
                      <FaCheck /> Bắt đầu làm
                    </> :
                    <>
                      <FaSave /> Lưu sửa đổi
                    </>
                  }
                </div>
              </button>
          }
          <button type="button"
            onClick={() => setPopUp(false)}
            className="py-2 max-w-[400px] mx-auto px-4 bg-red-600 hover:bg-red-500 transition-colors duration-200 rounded overflow-hidden w-full text-slate-100">
            <div className="flex gap-2 items-center w-max mx-auto">
              <FaArrowRightFromBracket /> Quay lại
            </div>
          </button>
        </form>
      </section>
    }
  </>
}