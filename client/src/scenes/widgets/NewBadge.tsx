import { StateInterface } from "@/api/types";
import { Badge } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
type Props = {
  userId?: string;
  children: React.ReactNode;
};

const NewBadge = (props: Props) => {
  const { children, userId } = props;

   // Access the activeUsers state from the Redux store
  const activeUsers = useSelector<StateInterface>(
    (state) => state.socketReducer.activeUsers
  ) as Array<string>;

   // State to track the active status of the user
  const [isActive, setIsActive] = useState(false);

   // Cleanup effect to reset isActive state when the component unmounts
  useEffect(() => {
    return () => {
      setIsActive(false);
    };
  }, []);

   // Effect to update isActive state based on activeUsers and userId
  useEffect(() => {
    if (userId) {
      if (activeUsers.includes(userId)) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }
  }, [activeUsers, userId]);

  return (
    <Badge
      overlap="rectangular"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      variant="dot"
      color={isActive ? "success" : "error"}
      sx={{ zIndex: 1 }}
    >
      {children}
    </Badge>
  );
};

export default NewBadge;
