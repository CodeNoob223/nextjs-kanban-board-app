"use client";
import { FaCircleCheck, FaCircleXmark, FaCirclePlay } from "react-icons/fa6";
import { BiTrash } from "react-icons/bi";
import { useAppDispatch } from "@/store";
import { Draggable } from "@hello-pangea/dnd";
import { putTodo, deleteTodos } from "@/store/slices/todoSlice";

interface ToDoCardType extends ToDo {
  index: number,
  selfUnmount: (id: number, colName: ToDo["status"]) => void
}
export default function ToDoCard(props: ToDoCardType): JSX.Element {
  const dispatch = useAppDispatch();

  const markTodo = async () => {
    const change = {
      "Pending": "Working",
      "Working": "Done",
      "Done": "Pending"
    };

    const res = await dispatch(putTodo({
      id: props.id,
      from: props.status,
      to: change[props.status] as ToDo["status"],
      fromIndex: props.index,
      toIndex: -1 //Hop to the end of the next column
    }));

    if (res.meta.requestStatus === "rejected") {
      console.log(res);
    } else {
      props.selfUnmount(props.id, props.status);
    }
  };

  const deleteTodo = async () => {
    const res = await dispatch(deleteTodos({
      id: props.id,
      status: props.status
    }));

    
    if (res.meta.requestStatus === "rejected") {
      console.log(res);
    } else {
      props.selfUnmount(props.id, props.status);
    }
  }

  return <Draggable
    draggableId={props.id.toString()}
    index={props.index}
  >
    {
      (provided, snapshot) => (
        <div className={`p-4 flex-shrink-0 w-[300px] bg-slate-200 shadow-md shadow-slate-400 rounded-md overflow-hidden m-0 ${snapshot.isDragging ? "opacity-70" : ""}`}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex mb-2 select-none">
            <p className="p-2 bg-slate-500 rounded mr-2 text-xs text-slate-50">id: {props.id}</p>
            {props.status === "Done" &&
              <p className={`p-2 bg-green-500 rounded w-max text-slate-50 text-xs`}>Done</p>
            }
            {props.status === "Pending" &&
              <p className={`p-2 bg-red-500 rounded w-max text-slate-50 text-xs`}>Pending</p>
            }
            {props.status === "Working" &&
              <p className={`p-2 bg-blue-500 rounded w-max text-slate-50 text-xs`}>Working</p>
            }

            <BiTrash className="text-3xl ml-auto mr-2 text-slate-400 hover:text-red-600 cursor-pointer" onClick={deleteTodo} />

            {props.status === "Done" &&
              <FaCircleCheck className="text-3xl text-green-500 hover:text-green-600 cursor-pointer" onClick={markTodo} />
            }
            {props.status === "Pending" &&
              <FaCircleXmark className="text-3xl text-red-500 hover:text-red-600 cursor-pointer" onClick={markTodo} />
            }
            {props.status === "Working" &&
              <FaCirclePlay className="text-3xl text-blue-500 hover:text-blue-600 cursor-pointer" onClick={markTodo} />
            }

          </div>
          <p className="font text-sm">Author: {props.profiles?.username}</p>
          <p className="font text-sm">Time: {new Date(props.inserted_at).toDateString()}</p>
          <p className="font text-sm"><span className="text-red-700 font-semibold">Target:</span> {props.deadline ? new Date(props.deadline).toDateString() : "None"}</p>
          <p>Content: {props.task}</p>
        </div>
      )
    }
  </Draggable>
}