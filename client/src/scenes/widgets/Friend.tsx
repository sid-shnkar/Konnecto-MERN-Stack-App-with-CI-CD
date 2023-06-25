import FlexBetween from "@/components/FlexBetween"; // Importing the FlexBetween component from the local file
import { FriendInterface } from "@/api/types"; // Importing the FriendInterface type from the API module
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material"; // Importing components and hooks from the MUI library
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";  // Importing the PersonRemoveOutlinedIcon component from the MUI library
import { useAddFriendMutation } from "@/api"; // Importing the useAddFriendMutation hook from the API module
import { Link } from "react-router-dom"; // Importing the Link component from the react-router-dom module

type Props = {
  friend: FriendInterface;
  userId: string;
  isOwner: boolean;
};

const Friend = (props: Props) => {
  const { friend, userId, isOwner } = props;
  const [addFriend] = useAddFriendMutation(); // Mutation hook for adding a friend
  const theme = useTheme(); // Hook for accessing the current theme
  const handleRemoveFriend = async () => {
    await addFriend(`${userId}/${friend._id}`); // Function to handle removing a friend by calling the addFriend mutation
  };
  return (
    <Box sx={{ width: "100%" }}>
      <FlexBetween>
        <Box display={"flex"} gap={"12px"}>
          <Avatar
            src={
              friend.picturePath.length > 0
                ? `${import.meta.env.VITE_BASE_URL}/assets/${
                    friend.picturePath
                  }`
                : "/assets/react.svg"
            }
            sx={{ height: "3rem", width: "3rem" }}
          />
          <Box display={"flex"} flexDirection={"column"} gap={"0.3rem"}>
            <Link
              to={`/profile/${friend._id}`}
              style={{
                fontWeight: 500,
                textDecoration: "none",
                color: theme.palette.primary.dark,
                fontSize: "1rem",
              }}
            >
              {friend.firstName} {friend.lastName}
            </Link>
            <Typography variant="h6" color={theme.palette.neutral.medium}>
              {friend.location}
            </Typography>
          </Box>
        </Box>
        {isOwner && (
          <IconButton onClick={handleRemoveFriend}>
            <PersonRemoveOutlinedIcon sx={{ fontSize: "1.5rem" }} />
          </IconButton>
        )}
      </FlexBetween>
    </Box>
  );
};

export default Friend;
