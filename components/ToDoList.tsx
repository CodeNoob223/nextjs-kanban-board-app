"use client";

import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import ToDoCard from "./TodoCard";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toUpperFirst, updateTodos } from "@/store/slices/todoSlice";
import { addNotification } from "@/store/slices/notificationSlice";

export default function ToDosList() {
  const todos = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();

  const [pending, setPending] = useState<ToDo[]>([]);
  const [working, setWorking] = useState<ToDo[]>([]);
  const [done, setDone] = useState<ToDo[]>([]);

  useEffect(() => {
    setPending(todos.filter(td => td.status === "Pending"));
    setWorking(todos.filter(td => td.status === "Working"));
    setDone(todos.filter(td => td.status === "Done"));

    const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder") as string) as number[];
    const workingOrder = JSON.parse(localStorage.getItem("workingOrder") as string) as number[];
    const doneOrder = JSON.parse(localStorage.getItem("doneOrder") as string) as number[];

    if (!pendingOrder && todos.length) {
      const newOrder = todos.filter(td => td.status === "Pending").map(td => td.id);
      localStorage.setItem('pendingOrder', JSON.stringify(newOrder));
    }
    if (!workingOrder && todos.length) {
      const newOrder = todos.filter(td => td.status === "Working").map(td => td.id);
      localStorage.setItem('workingOrder', JSON.stringify(newOrder));
    }
    if (!doneOrder && todos.length) {
      const newOrder = todos.filter(td => td.status === "Done").map(td => td.id);
      localStorage.setItem('doneOrder', JSON.stringify(newOrder));
    }

    let myArray: ToDo[] = [];
    if (pendingOrder?.length && todos.length) {
      myArray = pendingOrder.map(pos => {
        return todos.find(el => el.id === pos);
      }) as ToDo[];

      //Tim them item moi de cho vao local storage
      const newItems = todos.filter(el => {
        return !pendingOrder.includes(el.id) && el.status === "Pending";
      });

      if (newItems?.length) myArray = [...newItems, ...myArray];
      setPending(myArray);
    }


    myArray = [];
    if (workingOrder?.length && todos.length) {
      myArray = workingOrder.map(pos => {
        return todos.find(el => el.id === pos);
      }) as ToDo[];

      //Tim them item moi de cho vao local storage
      const newItems = todos.filter(el => {
        return !workingOrder.includes(el.id) && el.status === "Working";
      });

      if (newItems?.length) myArray = [...newItems, ...myArray];
      setWorking(myArray);
    }

    if (doneOrder?.length && todos.length) {
      myArray = doneOrder.map(pos => {
        return todos.find(el => el.id === pos);
      }) as ToDo[];

      //Tim them item moi de cho vao local storage
      const newItems = todos.filter(el => {
        return !doneOrder.includes(el.id) && el.status === "Done";
      });

      if (newItems?.length) myArray = [...newItems, ...myArray];
      setDone(myArray);
    }
  }, [todos]);

  const changeOrder = (destinationIndex: number, sourceIndex: number, destination: string) => {
    let newData = [] as ToDo[];
    if (destination === "pending") {
      newData = [...pending];
    } else if (destination === "working") {
      newData = [...working];
    } else if (destination === "done") {
      newData = [...done];
    };

    const [reoderedTodos] = newData.splice(sourceIndex, 1);
    newData.splice(destinationIndex, 0, reoderedTodos);

    let newOrder = newData.map(td => td.id);

    localStorage.setItem(destination + "Order", JSON.stringify(newOrder));
    if (destination === "pending") {
      setPending(newData);
    } else if (destination === "working") {
      setWorking(newData);
    } else if (destination === "done") {
      setDone(newData);
    }

  }

  const removeToDo = (index: number, colName: DroppableIds, destination: DroppableIds | "" = ""): ToDo => {
    let newData = [] as ToDo[];
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
        (destination[0].toUpperCase() + destination.slice(1)) as ToDo["status"]
    };

    let newOrder = newData.map(td => td.id);
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

  const addToDo = (index: number, colName: DroppableIds, newToDo: ToDo) => {
    let newData = [] as ToDo[];
    if (colName === "pending") {
      newData = [...pending];
    } else if (colName === "working") {
      newData = [...working];
    } else if (colName === "done") {
      newData = [...done];
    };

    newData.splice(index, 0, newToDo);

    let newOrder = newData.map(td => td.id);
    localStorage.setItem(colName + "Order", JSON.stringify(newOrder));

    dispatch(updateTodos({
      id: newToDo.id,
      status: newToDo.status
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
      changeOrder(result.destination.index, result.source.index, destination);
    } else if (from != destination) {
      const newToDo = removeToDo(result.source.index, from, destination);
      addToDo(result.destination.index, destination, newToDo);
    }

    const res = await fetch("http://localhost:3000/todos/api", {
      method: "PUT",
      body: JSON.stringify({
        id: parseInt(result.draggableId),
        from: toUpperFirst(from),
        to: toUpperFirst(destination)
      })
    });

    const { error }: PutSupaBaseRes = await res.json();

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

  const deleteDraggable = (id: number, colName: ToDo["status"]) => {
    if (colName === "Done") {
      setDone(prev => {
        let newData = prev.filter(td => td.id !== id);
        return newData;
      });
    } else if (colName === "Pending") {
      setPending(prev => {
        let newData = prev.filter(td => td.id !== id);
        return newData;
      });
    } else if (colName === "Working") {
      setWorking(prev => {
        let newData = prev.filter(td => td.id !== id);
        return newData;
      });
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="flex flex-shrink-0 gap-4 flex-wrap w-max">
        <div className="h-[70vh] w-max shadow-lg p-4 min-w-[332px] rounded-lg">
          <h1 className="text-2xl text-red-600 font-bold w-max mx-auto mb-5">Chưa làm</h1>
          <Droppable droppableId="pending">
            {
              (provided) => (
                <div className="flex flex-col flex-shrink-0 gap-3 w-full h-[90%] overflow-scroll relative"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {pending.map((todo, index) => {
                    if (todo)
                      return <ToDoCard
                        selfUnmount={deleteDraggable}
                        id={todo.id}
                        inserted_at={todo.inserted_at}
                        status={todo.status}
                        task={todo.task}
                        profiles={todo.profiles}
                        key={todo.id}
                        index={index}
                        deadline={todo.deadline}
                        team_id={todo.team_id}
                      />
                  })}
                  {provided.placeholder}
                </div>
              )
            }
          </Droppable>
        </div>
        <div className="h-[70vh] w-max shadow-lg p-4 min-w-[332px] rounded-lg">
          <h1 className="text-2xl text-blue-600 font-bold w-max mx-auto mb-5">Đang làm</h1>
          <Droppable droppableId="working">
            {
              (provided) => (
                <div className="flex flex-col flex-shrink-0 gap-3 w-full h-[90%] overflow-scroll relative"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {working.map((todo, index) => {
                    if (todo)
                      return <ToDoCard
                        selfUnmount={deleteDraggable}
                        id={todo.id}
                        inserted_at={todo.inserted_at}
                        status={todo.status}
                        task={todo.task}
                        profiles={todo.profiles}
                        key={todo.id}
                        index={index}
                        deadline={todo.deadline}
                        team_id={todo.team_id}
                      />
                  })}
                  {provided.placeholder}
                </div>
              )
            }
          </Droppable>
        </div>
        <div className="h-[70vh] min-w-[332px] shadow-lg p-4 rounded-lg w-max">
          <h1 className="text-2xl text-green-600 font-bold w-max mx-auto mb-5">Đã làm</h1>
          <Droppable droppableId="done">
            {
              (provided) => (
                <div className="flex flex-col flex-shrink-0 gap-3 w-full h-[90%] overflow-scroll relative"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {done.map((todo, index) => {
                    if (todo)
                      return <ToDoCard
                        selfUnmount={deleteDraggable}
                        id={todo.id}
                        inserted_at={todo.inserted_at}
                        status={todo.status}
                        task={todo.task}
                        profiles={todo.profiles}
                        key={todo.id}
                        index={index}
                        deadline={todo.deadline}
                        team_id={todo.team_id}
                      />
                  })}
                  {provided.placeholder}
                </div>
              )
            }
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  )
}