import { Button, Dialog, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { statusMap } from "./BoardInterface";
import { IoMdClose } from "react-icons/io";

// import AddTaskIc
const AddTaskModal = ({ tabName, onClose, addTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(tabName);
  const [priority, setPriority] = useState("Medium");

  const statusOptions = Object.values(statusMap);

  const priorityOptions = ["Low", "Medium", "High"];

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      alert("Title is required");
      return;
    }
    console.log("Adding task:", {
      taskTitle,
      description,
      dueDate,
      status,
      priority,
    });
    addTask({ taskTitle, description, dueDate, status, priority });
    onClose(); // Close modal after adding task
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <Stack p={4} className="bg-white text-black">
        {/* Header with icon and close button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <AddTaskIcon fontSize="large" color="primary" /> */}
            <Typography variant="h6" fontWeight={600}>
              Create New Task
            </Typography>
          </Stack>
          <IoMdClose className="cursor-pointer" onClick={onClose} />
        </Stack>

        {/* Form Fields */}
        <Stack spacing={4}>
          {/* Task Title */}
          <div>
            <Typography variant="body1" fontWeight={500}>
              Task Title
            </Typography>
            <input
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Typography variant="body1" fontWeight={500}>
              Description
            </Typography>
            <textarea
              placeholder="Add description here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Due Date */}
          <div>
            <Typography variant="body1" fontWeight={500}>
              Select Date
            </Typography>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Status */}
          <div>
            <Typography variant="body1" fontWeight={500}>
              Status
            </Typography>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <Typography variant="body1" fontWeight={500}>
              Priority
            </Typography>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md bg-white"
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Add Task Button */}
          <div className="flex justify-end items-center gap-2 cursor-pointer">
            <div
              onClick={onClose}
              className="rounded-md border-2 border-[#8A30E5] text-[#8A30E5] py-2 px-3"
            >
              Cancel
            </div>
            <div
              onClick={handleAddTask}
              className="rounded-md border-2 border-[#8A30E5] bg-[#8A30E5] text-white py-2 px-3"
            >
              Create
            </div>
          </div>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddTaskModal;
