"use client";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { BiTrash } from "react-icons/bi";
import { useAppDispatch } from "@/store";
import { Draggable } from "@hello-pangea/dnd";
import { putTodo, deleteTodos } from "@/store/slices/todoSlice";

interface TaskCardType extends Task {
  index: number,
  selfUnmount: (id: number, colName: Task["status"]) => void
}
export default function TaskCard(props: TaskCardType): JSX.Element {
  const dispatch = useAppDispatch();

  const markTodo = async () => {
    const change = {
      "Pending": "Working",
      "Working": "Done",
      "Done": "Pending"
    };

    const res = await dispatch(putTodo({
      id: props.task_id,
      from: props.status,
      to: change[props.status] as Task["status"],
      fromIndex: props.index,
      toIndex: -1 //Hop to the end of the next column
    }));

    if (res.meta.requestStatus === "rejected") {
      console.log(res);
    } else {
      props.selfUnmount(props.task_id, props.status);
    }
  };

  const deleteTodo = async () => {
    const res = await dispatch(deleteTodos({
      id: props.task_id,
      status: props.status
    }));


    if (res.meta.requestStatus === "rejected") {
      console.log(res);
    } else {
      props.selfUnmount(props.task_id, props.status);
    }
  }

  return <Draggable
    draggableId={props.task_id.toString()}
    index={props.index}
  >
    {
      (provided, snapshot) => (
        <div className={`p-4 flex-shrink-0 lg:w-[300px] w-full bg-slate-200 shadow-md rounded-md overflow-hidden m-0 ${snapshot.isDragging ? "opacity-70" : ""}`}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex mb-2 select-none">
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

            {props.status === "Done" &&
              <FaCircleCheck className="lg:text-3xl text-2xl text-green-500 hover:text-green-600 cursor-pointer" onClick={markTodo} />
            }
            {props.status === "Pending" &&
              <FaCircleXmark className="lg:text-3xl text-2xl text-red-500 hover:text-red-600 cursor-pointer" onClick={markTodo} />
            }
            {props.status === "Working" &&
              <FaCirclePlay className="lg:text-3xl text-2xl text-blue-500 hover:text-blue-600 cursor-pointer" onClick={markTodo} />
            }
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
        </div>
      )
    }
  </Draggable>
}