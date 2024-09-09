import React, { useState } from "react";
import {
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Draggable } from "react-beautiful-dnd";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TodayIcon from "@mui/icons-material/Today";
import { statusMap } from "./BoardInterface";

const Task = ({
  id,
  status,
  text,
  desc,
  date,
  priority,
  index,
  removeTask,
  onClick,
  updateTaskStatus,
  openEditModal, // Added for handling edit
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (status) => {
    updateTaskStatus(id, status);
    handleClose();
  };

  const handleEditClick = () => {
    openEditModal(id); // Trigger the edit modal
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "todos":
        return "#8A31E5"; // Example color for Todos
      case "inProgress":
        return "#F5A623"; // Example color for In Progress
      case "completed":
        return "#4CAF50"; // Example color for Completed
      default:
        return "#E3E3E3"; // Default color
    }
  };
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "Low":
        return {
          backgroundColor: "#F0FFDD",
          color: "#8A8A8A",
        };
      case "Medium":
        return {
          backgroundColor: "#FFECE1",
          color: "#FF00B8",
        };
      case "High":
        return {
          backgroundColor: "#FFDDDD",
          color: "#FF5C00",
        };
      default:
        return {
          backgroundColor: "#FFFFFF",
          color: "#000000",
        };
    }
  };

  const { backgroundColor, color } = getPriorityStyles(priority);
  const statusColor = getStatusColor(status);
  console.log("i am", status, statusColor);
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <Stack
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          direction="row"
          alignItems="center"
          spacing={1}
          className="w-72 relative bg-white p-4 gap-3 rounded-xl border border-gray-300 shadow-[0_0_0_0_rgba(0,0,0,0.03)]"
        >
          <div
            className="absolute left-[-1px] py-10 px-[1px]"
            style={{ backgroundColor: statusColor }}
          ></div>
          <div className="flex flex-col w-full gap-2">
            <div
              style={{ backgroundColor, color }}
              className="text-xs rounded-lg p-2 w-fit"
            >
              {priority}
            </div>
            <div className="flex items-center justify-between font-bold">
              <Typography
                {...(!!onClick ? { onClick: onClick } : {})}
                className="w-full text-black"
              >
                {text}
              </Typography>
              <div>
                <IconButton onClick={handleClick}>
                  <KeyboardArrowDownIcon
                    sx={{ color: "black", fontSize: 26 }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      backgroundColor: "white",
                      color: "black",
                      maxHeight: 224,
                      width: "20ch",
                      borderRadius: "0.5rem",
                    },
                  }}
                >
                  <MenuItem
                    disabled
                    className="font-semibold"
                    sx={{ backgroundColor: "#e4ecff" }}
                  >
                    Change Status
                  </MenuItem>
                  <Divider />
                  {Object.keys(statusMap).map((statusKey) => (
                    <MenuItem
                      key={statusKey}
                      onClick={() => handleMenuItemClick(statusMap[statusKey])}
                    >
                      {statusMap[statusKey]}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
              <div className="flex items-center">
                <IconButton onClick={handleEditClick}>
                  <EditIcon sx={{ color: "black", fontSize: 20 }} />
                </IconButton>
                <IconButton onClick={removeTask}>
                  <DeleteIcon sx={{ color: "black", fontSize: 20 }} />
                </IconButton>
              </div>
            </div>
            <Typography
              sx={{ fontSize: 14 }}
              className="text-[#787486] flex-wrap truncate overflow-hidden text-ellipsis line-clamp-2"
            >
              {desc}
            </Typography>
            <div className="bg-[#E3E3E3] w-full p-[1px]" />
            <div className="flex items-center">
              <IconButton>
                <TodayIcon sx={{ fontSize: 15, color: "black " }} />
              </IconButton>
              <Typography sx={{ fontSize: 13 }} className="text-[#787486]">
                {date}
              </Typography>
            </div>
          </div>
        </Stack>
      )}
    </Draggable>
  );
};

export default Task;
