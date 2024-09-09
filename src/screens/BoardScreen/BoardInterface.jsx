import { useState, useCallback } from "react";
import { Button, Grid } from "@mui/material";
import AddTaskModal from "./AddTaskModal";
import BoardTab from "./BoardTab";
import useApp from "../../hooks/useApp";
import useStore from "../../store";
import { DragDropContext } from "react-beautiful-dnd";
import AppLoader from "../../components/layout/AppLoader";
import ShiftTaskModal from "./ShiftTaskModal";
import EditTaskModal from "./EditTaskModal";

export const statusMap = {
  todos: "Todos",
  inProgress: "In Progress",
  completed: "Completed",
};

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const BoardInterface = ({ boardData, boardId, updateLastUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [shiftTask, setShiftTask] = useState(null);
  const [addTaskTo, setAddTaskTo] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [tabs, setTabs] = useState(structuredClone(boardData));
  const { updateBoardData } = useApp();
  const { setToastr } = useStore();

  const handleOpenAddTaskModal = useCallback(
    (status) => setAddTaskTo(status),
    []
  );

  const handleOpenShiftTaskModal = useCallback(
    (task) => setShiftTask(task),
    []
  );

  const handleOpenEditTaskModal = useCallback(
    (taskId) => {
      const task = Object.values(tabs)
        .flat()
        .find((t) => t.id === taskId);
      setEditTask(task);
    },
    [tabs]
  );

  const handleCloseEditTaskModal = useCallback(() => {
    setEditTask(null);
  }, []);
  const reverseStatusMap = Object.fromEntries(
    Object.entries(statusMap).map(([key, value]) => [value, key])
  );

  const updateTaskStatus = async (taskId, newStatus) => {
    console.log("Updating task:", taskId);
    console.log("New Status:", newStatus);

    // Convert display name to internal key
    const internalStatus = reverseStatusMap[newStatus];

    // Check if internalStatus exists in dClone
    if (!internalStatus) {
      console.error("Invalid status key:", newStatus);
      return;
    }

    const dClone = structuredClone(tabs);
    console.log("Cloned Tabs:", dClone);

    // Check if internalStatus exists in dClone
    if (!dClone[internalStatus]) {
      console.error("Invalid status key in dClone:", internalStatus);
      return;
    }

    let taskToUpdate;
    let oldStatus;

    // Locate and remove the task from its old status
    for (const status of Object.keys(statusMap)) {
      const taskIdx = dClone[status].findIndex((task) => task.id === taskId);
      if (taskIdx !== -1) {
        taskToUpdate = dClone[status].splice(taskIdx, 1)[0];
        oldStatus = status;
        break;
      }
    }

    if (taskToUpdate) {
      // Add the task to the new status
      dClone[internalStatus].unshift(taskToUpdate);
      console.log("Task updated:", taskToUpdate);

      try {
        await handleUpdateBoardData(dClone);
      } catch (err) {
        console.error("Error updating board data:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleShiftTask = async (newStatus) => {
    const oldStatus = shiftTask.status;
    if (newStatus === oldStatus) return setShiftTask(null);
    const dClone = structuredClone(tabs);

    // Remove the task from the old status
    const [task] = dClone[oldStatus].splice(shiftTask.index, 1);

    // Add the task to the new status
    dClone[newStatus].unshift(task);

    try {
      await handleUpdateBoardData(dClone);
      setShiftTask(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBoardData = async (dClone) => {
    setLoading(true);
    try {
      await updateBoardData(boardId, dClone);
      setTabs(dClone);
      updateLastUpdated();
      setToastr("Board updated!");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTask = useCallback(
    async (tab, taskId) => {
      const dClone = structuredClone(tabs);
      const taskIdx = dClone[tab].findIndex((t) => t.id === taskId);
      dClone[tab].splice(taskIdx, 1);

      try {
        await handleUpdateBoardData(dClone);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [tabs]
  );

  const handleAddTask = async ({
    taskTitle,
    description,
    dueDate,
    status,
    priority,
  }) => {
    console.log("Adding task with status:", status);

    if (!taskTitle.trim()) return setToastr("Title cannot be empty!");

    const statusKey = Object.keys(statusMap).find(
      (key) => statusMap[key] === status
    );

    if (!statusKey || !tabs[statusKey]) {
      console.error(`Invalid status: ${status}`);
      return;
    }

    const dClone = structuredClone(tabs);
    dClone[statusKey].unshift({
      taskTitle,
      description,
      dueDate,
      status,
      priority,
      id: crypto.randomUUID(),
    });

    try {
      console.log("Updating board data...");
      await handleUpdateBoardData(dClone);
      setAddTaskTo("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDnd = async ({ source, destination }) => {
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const dClone = structuredClone(tabs);

    // Remove the task from the source
    const [draggedTask] = dClone[source.droppableId].splice(source.index, 1);

    // Add it to the destination
    dClone[destination.droppableId].splice(destination.index, 0, draggedTask);

    try {
      await handleUpdateBoardData(dClone);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleEditTask = async (updatedTask) => {
    const dClone = structuredClone(tabs);
    let taskUpdated = false;

    for (const status of Object.keys(statusMap)) {
      const taskIdx = dClone[status].findIndex(
        (task) => task.id === updatedTask.id
      );
      if (taskIdx !== -1) {
        dClone[status][taskIdx] = updatedTask;
        taskUpdated = true;
        break;
      }
    }

    if (taskUpdated) {
      try {
        await handleUpdateBoardData(dClone);
      } catch (err) {
        console.error("Error updating board data:", err);
      } finally {
        setLoading(false);
      }
    }
  };
  if (loading) return <AppLoader />;
  return (
    <>
      {!!shiftTask && (
        <ShiftTaskModal
          shiftTask={handleShiftTask}
          task={shiftTask}
          onClose={() => setShiftTask(null)}
        />
      )}
      {!!addTaskTo && (
        <AddTaskModal
          tabName={statusMap[addTaskTo]}
          onClose={() => setAddTaskTo("")}
          addTask={handleAddTask}
          loading={loading}
        />
      )}
      {editTask && (
        <EditTaskModal
          open={!!editTask}
          task={editTask}
          onClose={handleCloseEditTaskModal}
          onSave={handleEditTask}
        />
      )}
      <div className="bg-[#f3f3f3] text-black p-4 w-full mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 py-6 my-4 bg-white rounded-xl">
          <div className="font-bold text-lg text-center md:text-left">
            Desktop & Mobile Application
          </div>
          <div
            onClick={() => handleOpenAddTaskModal("todos")} // Default to adding to "todos"
            className="mt-4 md:mt-0 cursor-pointer"
          >
            <div className="w-full md:w-40 py-3 px-7 bg-[#8A31E5] text-center text-white rounded-xl">
              Create Task
            </div>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDnd}>
        <Grid
          container
          px={2}
          spacing={2}
          className="bg-[#f3f3f3] min-h-screen w-full"
        >
          {Object.keys(statusMap).map((status) => (
            <BoardTab
              key={status}
              status={status}
              tasks={tabs[status]}
              name={statusMap[status]}
              openAddTaskModal={handleOpenAddTaskModal}
              openShiftTaskModal={handleOpenShiftTaskModal}
              removeTask={handleRemoveTask}
              handleOpenEditTaskModal={handleOpenEditTaskModal}
              updateTaskStatus={updateTaskStatus}
            />
          ))}
        </Grid>
      </DragDropContext>
    </>
  );
};

export default BoardInterface;
