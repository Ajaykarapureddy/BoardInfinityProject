import { memo } from "react";
import {
  Grid,
  Stack,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import Task from "./Task";
import Droppable from "../../components/utils/StrictModeDroppable";

const BoardTab = ({
  name,
  status,
  openAddTaskModal,
  tasks,
  removeTask,
  openShiftTaskModal,
  handleOpenEditTaskModal,
  updateTaskStatus,
}) => {
  const colorMap = {
    Todos: "#8A30E5", // Example colors for different names
    "In Progress": "#FFC14E",
    Completed: "#06C270",
  };
  console.log("Tab: ", name);
  const isXs = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <Grid
          {...provided.droppableProps}
          ref={provided.innerRef}
          item
          xs={12}
          sm={4}
        >
          {/* <Stack p={15} sx={{ backgroundColor: colorMap[name] }}> */}
          <div className="flex flex-col justify-center items-center gap-4 bg-white pb-8 rounded-b-md">
            {console.log(colorMap[name], "colors")}
            <div
              style={{ backgroundColor: colorMap[name] }}
              className={`rounded-t-md py-2 w-full mx-auto`}
            >
              <Typography fontWeight={400} variant="h6" className="text-center">
                {name}
              </Typography>
              {/* <IconButton onClick={() => openAddTaskModal(status)}>
                <AddIcon fontSize="small" />
              </IconButton> */}
            </div>
            {/* <div className="flex flex-col justify-center items-center"> */}
            {console.log("list", tasks)}
            {tasks.map((task, index) => (
              <Task
                onClick={
                  isXs
                    ? () =>
                        openShiftTaskModal({
                          text: task.text,
                          index: index,
                          status: status,
                        })
                    : null
                }
                status={status}
                key={task.id}
                text={task.taskTitle}
                desc={task.description}
                date={task.dueDate}
                priority={task.priority}
                id={task.id}
                removeTask={() => removeTask(status, task.id)}
                index={index}
                openEditModal={handleOpenEditTaskModal}
                updateTaskStatus={updateTaskStatus}
              />
            ))}
            {/* </div> */}
            {provided.placeholder}
          </div>
        </Grid>
      )}
    </Droppable>
  );
};

export default memo(BoardTab);
