"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { toUpperFirst, updateTodos } from "@/store/slices/todoSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import ToDoCol from "./TaskCol";
import SearchForm from "./SearchForm";

export default function ToDosList({ todos }: { todos: Task[] }) {
  const dispatch = useAppDispatch();

  const [pending, setPending] = useState<Task[]>([]);
  const [working, setWorking] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);

  const [search, setSearch] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");
  const [searchDeadline, setSearchDeadline] = useState<string>("");

  useEffect(() => {
    setPending(todos.filter(td => td.status === "Pending"));
    setWorking(todos.filter(td => td.status === "Working"));
    setDone(todos.filter(td => td.status === "Done"));

    const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder") as string) as number[];
    const workingOrder = JSON.parse(localStorage.getItem("workingOrder") as string) as number[];
    const doneOrder = JSON.parse(localStorage.getItem("doneOrder") as string) as number[];

    if (!pendingOrder && todos.length) {
      const newOrder = todos.filter(td => td.status === "Pending").map(td => td.task_id);
      localStorage.setItem('pendingOrder', JSON.stringify(newOrder));
    }
    if (!workingOrder && todos.length) {
      const newOrder = todos.filter(td => td.status === "Working").map(td => td.task_id);
      localStorage.setItem('workingOrder', JSON.stringify(newOrder));
    }
    if (!doneOrder && todos.length) {
      const newOrder = todos.filter(td => td.status === "Done").map(td => td.task_id);
      localStorage.setItem('doneOrder', JSON.stringify(newOrder));
    }

    let myArray: Task[] = [];
    if (pendingOrder?.length && todos.length) {
      myArray = pendingOrder.map(pos => {
        return todos.find(el => el.task_id === pos);
      }) as Task[];

      //Tim them item moi de cho vao local storage
      const newItems = todos.filter(el => {
        return !pendingOrder.includes(el.task_id) && el.status === "Pending";
      });

      if (newItems?.length) myArray = [...newItems, ...myArray];
      setPending(myArray);
    }


    myArray = [];
    if (workingOrder?.length && todos.length) {
      myArray = workingOrder.map(pos => {
        return todos.find(el => el.task_id === pos);
      }) as Task[];

      //Tim them item moi de cho vao local storage
      const newItems = todos.filter(el => {
        return !workingOrder.includes(el.task_id) && el.status === "Working";
      });

      if (newItems?.length) myArray = [...newItems, ...myArray];
      setWorking(myArray);
    }

    if (doneOrder?.length && todos.length) {
      myArray = doneOrder.map(pos => {
        return todos.find(el => el.task_id === pos);
      }) as Task[];

      //Tim them item moi de cho vao local storage
      const newItems = todos.filter(el => {
        return !doneOrder.includes(el.task_id) && el.status === "Done";
      });

      if (newItems?.length) myArray = [...newItems, ...myArray];
      setDone(myArray);
    }
  }, [todos]);

  const changeOrder = (destinationIndex: number, sourceIndex: number, destination: string) => {
    let newData = [] as Task[];
    if (destination === "pending") {
      newData = [...pending];
    } else if (destination === "working") {
      newData = [...working];
    } else if (destination === "done") {
      newData = [...done];
    };

    const [reoderedTodos] = newData.splice(sourceIndex, 1);
    newData.splice(destinationIndex, 0, reoderedTodos);

    let newOrder = newData.map(td => td.task_id);

    localStorage.setItem(destination + "Order", JSON.stringify(newOrder));
    if (destination === "pending") {
      setPending(newData);
    } else if (destination === "working") {
      setWorking(newData);
    } else if (destination === "done") {
      setDone(newData);
    }

  }

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

    let newOrder = newData.map(td => td.task_id);
    localStorage.setItem(colName + "Order", JSON.stringify(newOrder));

    if (colName === "pending") {
      setPending(newData);
    } else if (colName === "working") {
      setWorking(newData);
    } else if (colName === "done") {
      setDone(newData);
    }

    return removedTodo;
  }

  const addTask = (index: number, colName: DroppableIds, newToDo: Task) => {
    let newData = [] as Task[];
    if (colName === "pending") {
      newData = [...pending];
    } else if (colName === "working") {
      newData = [...working];
    } else if (colName === "done") {
      newData = [...done];
    };

    newData.splice(index, 0, newToDo);

    if (newData.length > 0) {
      console.log(newData);
      let newOrder = newData.map(td => td.task_id);
      localStorage.setItem(colName + "Order", JSON.stringify(newOrder));
  
      dispatch(updateTodos({
        id: newToDo.task_id,
        status: newToDo.status,
        progress: ""
      }));
    }

    // if (colName === "pending") {
    //   setPending(newData);
    // } else if (colName === "working") {
    //   setWorking(newData);
    // } else if (colName === "done") {
    //   setDone(newData);
    // }
  }

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    let from = result.source.droppableId as DroppableIds;
    let destination = result.destination.droppableId as DroppableIds;

    if (from === destination) {
      if (result.source.index === result.source.index) return;

      changeOrder(result.destination.index, result.source.index, destination);
    } else if (from != destination) {
      const newToDo = removeTask(result.source.index, from, destination);
      addTask(result.destination.index, destination, newToDo);
    }

    const res = await fetch(`${location.origin}/todos/api`, {
      method: "PUT",
      body: JSON.stringify({
        id: parseInt(result.draggableId),
        from: toUpperFirst(from),
        to: toUpperFirst(destination)
      })
    });

    const { error }: PutSupaBaseRes<Task> = await res.json();

    if (error) {
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("workingOrder");
      localStorage.removeItem("doneOrder");
      dispatch(addNotification({
        content: error,
        type: "error"
      }));

      setTimeout(() => {
        window.location.reload();
      }, 400);

      return;
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
          <ToDoCol
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
          <ToDoCol
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
          <ToDoCol
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