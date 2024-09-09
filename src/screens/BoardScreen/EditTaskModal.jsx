import React, { useState, useEffect } from "react";
import { Button, TextField, Dialog, Typography } from "@mui/material";

const EditTaskModal = ({ open, task, onClose, onSave }) => {
  const [editedTask, setEditedTask] = useState(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose(); // Close the modal after saving
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <div className="p-4 bg-white rounded-lg text-black">
        <Typography variant="h6" fontWeight={600}>
          Edit Task
        </Typography>
        <h2>Task Title</h2>
        <div className="flex flex-col gap-4">
          <input
            name="taskTitle"
            label="Title"
            value={editedTask.taskTitle || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="w-full h-10 px-4 py-2 border border-gray-300 rounded-md"
          />
          <h2>Description</h2>
          <textarea
            name="description"
            label="Description"
            value={editedTask.description || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            className="w-full h-24 px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            name="dueDate"
            label="Due Date"
            type="date"
            value={editedTask.dueDate || ""}
            onChange={handleChange}
            className="w-full h-12 px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div
          className="rounded-md text-center border-2 border-[#8A30E5] bg-[#8A30E5] text-white py-2 px-3"
          onClick={handleSave}
        >
          Save
        </div>
      </div>
    </Dialog>
  );
};

export default EditTaskModal;
