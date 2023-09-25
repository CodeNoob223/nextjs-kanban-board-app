import { Droppable } from "@hello-pangea/dnd"
import ProjectTaskCard from "./ProjectTaskCard"

export default function ProjectTaskCol(props: {
  dropableId: DroppableIds,
  title: string,
  titleColor: "text-red-600" | "text-green-600" | "text-blue-600",
  todoArr: Task[],
  deleteDraggable: (id: number, colName: Task["status"]) => void
}): JSX.Element {
  return <div className="h-[70vh] 
          xl:w-max min-[520px]:w-[28vw] w-full
          xl:p-4 sm:py-3 p-2
          xl:min-w-[332px] min-w-[220px]
          xl:mb-0 mb-4
          shadow-lg rounded-lg">
    <h1 className={`sm:text-2xl text-xl ${props.titleColor} flex-shrink-0 font-bold w-max mx-auto mb-5`}>
      {props.title}
    </h1>
    <Droppable droppableId={props.dropableId}>
      {
        (provided) => (
          <div className="flex flex-col flex-shrink-0 gap-3 w-full h-[90%] overflow-y-auto overflow-x-hidden custom-sb pb-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {props.todoArr.map((todo, index) => {
              if (todo)
                return <ProjectTaskCard
                  selfUnmount={props.deleteDraggable}
                  task_id={todo.task_id}
                  inserted_at={todo.inserted_at}
                  status={todo.status}
                  content={todo.content}
                  profiles={todo.profiles}
                  key={todo.task_id}
                  index={index}
                  deadline={todo.deadline}
                  project_id={todo.project_id}
                  progress={todo.progress}
                  workers={todo.workers}
                />
            })}
            {provided.placeholder}
          </div>
        )
      }
    </Droppable>
  </div>
}