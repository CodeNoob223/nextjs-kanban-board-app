"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { toUpperFirst } from "@/store/slices/todoSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import ProjectTaskCol from "./ProjectTaskCol";
import SearchForm from "../SearchForm";

export default function ProjectTaskList({ tasks }: {
  tasks: Task[],
  user: UserState
}): JSX.Element {
  const dispatch = useAppDispatch();

  const [pending, setPending] = useState<Task[]>([]);
  const [working, setWorking] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);

  const [search, setSearch] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");
  const [searchDeadline, setSearchDeadline] = useState<string>("");

  useEffect(() => {
    setPending(tasks.filter(td => td.status === "Pending"));
    setWorking(tasks.filter(td => td.status === "Working"));
    setDone(tasks.filter(td => td.status === "Done"));

  }, [tasks]);

  const removeTask = (index: number, colName: DroppableIds, destination: DroppableIds | "" = ""): Task => {
    let newData = [] as Task[];
    if (colName === "pending") {
      newData = [...pending];
    } else if (colName === "working") {
      newData = [...working];
    } else if (colName === "done") {
      newData = [...done];
    };

    let [removedTodo] = newData.splice(index, 1);
    if (destination) removedTodo = {
      ...removedTodo,
      status:
        (destination[0].toUpperCase() + destination.slice(1)) as Task["status"]
    };

    if (colName === "pending") {
      setPending(newData);
    } else if (colName === "working") {
      setWorking(newData);
    } else if (colName === "done") {
      setDone(newData);
    }

    return removedTodo;
  }

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    let from = result.source.droppableId as DroppableIds;
    let destination = result.destination.droppableId as DroppableIds;

    // We can't change task order in projects
    if (from != destination) {
      const newToDo = removeTask(result.source.index, from, destination);
      // addTask(result.destination.index, destination, newToDo);

      const res = await fetch(`${location.origin}/todos/api`, {
        method: "PUT",
        body: JSON.stringify({
          id: newToDo.task_id,
          progress: newToDo.progress,
          to: toUpperFirst(destination),
          workers: newToDo.workers
        })
      });

      const { error }: PutSupaBaseRes<Task> = await res.json();

      if (error) {
        dispatch(addNotification({
          content: error,
          type: "error"
        }));

        setTimeout(() => {
          window.location.reload();
        }, 400);

        return;
      }
    }

  };

  const deleteDraggable = (id: number, colName: Task["status"]) => {
    if (colName === "Done") {
      setDone(prev => {
        let newData = prev.filter(td => td.task_id !== id);
        return newData;
      });
    } else if (colName === "Pending") {
      setPending(prev => {
        let newData = prev.filter(td => td.task_id !== id);
        return newData;
      });
    } else if (colName === "Working") {
      setWorking(prev => {
        let newData = prev.filter(td => td.task_id !== id);
        return newData;
      });
    }
  }

  return (
    <>
      <SearchForm
        deadlineStr={searchDeadline}
        deadlineInput={true}
        search={search}
        searchDate={searchDate}
        setSearch={(str: string) => { setSearch(str) }}
        setSearchDate={(str: string) => { setSearchDate(str) }}
        setDeadline={(str: string) => { setSearchDeadline(str) }}
      />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="flex min-[1130px]:flex-row xl:gap-4 min-[400px]:gap-2 gap-10 flex-wrap w-full">
          <ProjectTaskCol
            deleteDraggable={deleteDraggable}
            dropableId="pending"
            title="Đang chờ"
            titleColor="text-red-600"
            todoArr={pending.filter(td => {
              if (td) {
                if (td.content?.includes(search)) {
                  if (searchDate) {
                    let searchStr = new Date(searchDate).getFullYear().toString() + "-" + new Date(searchDate).getMonth().toString();
                    let tdDate = new Date(td.inserted_at).getFullYear().toString() + "-" + new Date(td.inserted_at).getMonth().toString();

                    if (searchStr !== tdDate) return false;
                  }
                  if (searchDeadline && td.deadline) {
                    let deadlineStr = new Date(searchDeadline).getFullYear().toString() + "-" + new Date(searchDeadline).getMonth().toString();
                    let tdDate = new Date(td.deadline).getFullYear().toString() + "-" + new Date(td.deadline).getMonth().toString();

                    if (deadlineStr !== tdDate) return false;
                  }
                  if (searchDeadline && !td.deadline) return false;

                  return true;
                }
              }
            })}
          />
          <ProjectTaskCol
            deleteDraggable={deleteDraggable}
            dropableId="working"
            title="Đang làm"
            titleColor="text-blue-600"
            todoArr={working.filter(td => {
              if (td) {
                if (td.content?.includes(search)) {
                  if (searchDate) {
                    let searchStr = new Date(searchDate).getFullYear().toString() + "-" + new Date(searchDate).getMonth().toString();
                    let tdDate = new Date(td.inserted_at).getFullYear().toString() + "-" + new Date(td.inserted_at).getMonth().toString();

                    if (searchStr !== tdDate) return false;
                  }
                  if (searchDeadline && td.deadline) {
                    let deadlineStr = new Date(searchDeadline).getFullYear().toString() + "-" + new Date(searchDeadline).getMonth().toString();
                    let tdDate = new Date(td.deadline).getFullYear().toString() + "-" + new Date(td.deadline).getMonth().toString();

                    if (deadlineStr !== tdDate) return false;
                  }
                  if (searchDeadline && !td.deadline) return false;

                  return true;
                }
              }
            })}
          />
          <ProjectTaskCol
            deleteDraggable={deleteDraggable}
            dropableId="done"
            title="Đã xong"
            titleColor="text-green-600"
            todoArr={done.filter(td => {
              if (td) {
                if (td.content?.includes(search)) {
                  if (searchDate) {
                    let searchStr = new Date(searchDate).getFullYear().toString() + "-" + new Date(searchDate).getMonth().toString();
                    let tdDate = new Date(td.inserted_at).getFullYear().toString() + "-" + new Date(td.inserted_at).getMonth().toString();

                    if (searchStr !== tdDate) return false;
                  }
                  if (searchDeadline && td.deadline) {
                    let deadlineStr = new Date(searchDeadline).getFullYear().toString() + "-" + new Date(searchDeadline).getMonth().toString();
                    let tdDate = new Date(td.deadline).getFullYear().toString() + "-" + new Date(td.deadline).getMonth().toString();

                    if (deadlineStr !== tdDate) return false;
                  }
                  if (searchDeadline && !td.deadline) return false;

                  return true;
                }
              }
            })}
          />
        </div>
      </DragDropContext>
    </>
  )
}