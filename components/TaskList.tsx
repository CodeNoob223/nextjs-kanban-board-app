"use client";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toUpperFirst, updateTodos } from "@/store/slices/todoSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import ToDoCol from "./TaskCol";

export default function ToDosList() {
  const todos = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();

  const [pending, setPending] = useState<Task[]>([]);
  const [working, setWorking] = useState<Task[]>([]);
  const [done, setDone] = useState<Task[]>([]);

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

    let newOrder = newData.map(td => td.task_id);
    localStorage.setItem(colName + "Order", JSON.stringify(newOrder));

    dispatch(updateTodos({
      id: newToDo.task_id,
      status: newToDo.status,
      progress: ""
    }));

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

    const res = await fetch("http://localhost:3000/todos/api", {
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
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="flex min-[1130px]:flex-row xl:gap-4 min-[400px]:gap-2 gap-10 flex-wrap w-full">
        <ToDoCol
          deleteDraggable={deleteDraggable}
          dropableId="pending"
          title="Đang chờ"
          titleColor="text-red-600"
          todoArr={pending}
        />
        <ToDoCol
          deleteDraggable={deleteDraggable}
          dropableId="working"
          title="Đang làm"
          titleColor="text-blue-600"
          todoArr={working}
        />
        <ToDoCol
          deleteDraggable={deleteDraggable}
          dropableId="done"
          title="Đã xong"
          titleColor="text-green-600"
          todoArr={done}
        />
      </div>
    </DragDropContext>
  )
}