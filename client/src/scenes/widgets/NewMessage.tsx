import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { FriendInterface, UserInterface } from "@/api/types";
import { useGetUserFriendsQuery } from "@/api";
import Loading from "@/components/Loading";
import Friend from "./Friend";

type Props = {
  displayNewMessage(e: React.MouseEvent<HTMLDivElement>): void;
  setShowMessage(arg: boolean): void;
  user?: UserInterface;
  handleStartChat(arg: Array<FriendInterface>): void;
};

const NewMessage = (props: Props) => {
  const { displayNewMessage, setShowMessage, user, handleStartChat } = props;

   // Access the current theme
  const theme = useTheme();

   // State variables
  const [findFriendValue, setFindFriendValue] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<
    Array<FriendInterface>
  >([]);
  const [friends, setFriends] = useState<Array<FriendInterface>>([]);

   // Event handler for finding a friend
  const handleFindFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFindFriendValue(e.currentTarget.value);
    setFriends([]);
  };

  // Fetch user friends using a query from the API
  const { data, isLoading, isFetching } = useGetUserFriendsQuery(
    user?._id || ""
  );

  // Event handler for selecting/deselecting a friend
  const handleSelectedFriend = (friend: FriendInterface) => {
    setSelectedFriends((prev) => {
      if (prev.includes(friend)) {
        return prev.filter((f) => f._id !== friend._id);
      }
      return [...prev, friend];
    });
  };

  // Cleanup effect to reset state when the component unmount
  useEffect(() => {
    return () => {
      setFindFriendValue("");
      setSelectedFriends([]);
    };
  }, []);

  // Effect to filter friends based on search value
  useEffect(() => {
    if (!isFetching && data && findFriendValue) {
      for (const person of data) {
        const fullName = person.firstName + " " + person.lastName;
        if (
          fullName.toLowerCase().indexOf(findFriendValue.toLowerCase()) !== -1
        ) {
          setFriends((prev) => {
            return [...prev, person];
          });
        }
      }
    }
  }, [findFriendValue, isFetching, data]);

  // Render JSX for all friends
  const allFriends = friends?.map((friend) => (
    <Box
      key={friend._id}
      display={"flex"}
      padding={"0.5rem 1rem"}
      justifyContent={"space-between"}
    >
      <Friend friend={friend} userId={user?._id || ""} isOwner={false} />
      <Checkbox
        checked={selectedFriends.includes(friend)}
        onClick={() => handleSelectedFriend(friend)}
      />
    </Box>
  ));

  // Render JSX for selected friends' labels
  const selectedFriendsLabel = selectedFriends.map((friend) => {
    return (
      <Box
        key={`${friend._id}-label`}
        sx={{
          background: theme.palette.primary.light,
          padding: "0.2rem 0.5rem",
          borderRadius: "0.8rem",
          display: "flex",
          gap: "0.3rem",
          alignItems: "center",
        }}
      >
        <Typography sx={{ whiteSpace: "nowrap" }}>
          {friend.firstName} {friend.lastName}
        </Typography>
        <IconButton onClick={() => handleSelectedFriend(friend)}>
          <CloseIcon />
        </IconButton>
      </Box>
    );
  });

  // Render loading indicator if data is loading
  if (isLoading) return <Loading />;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.7rem",
        padding: "1rem",
        width: "35vw",
        overflowX: "auto",
      }}
      onClick={displayNewMessage}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography variant={"h4"} sx={{ mx: "auto" }}>
          New Message
        </Typography>
        <IconButton
          onClick={() => setShowMessage(false)}
          sx={{ position: "absolute", right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      </Box>
      <Divider sx={{ my: "1rem" }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Typography
          sx={{ wordBreak: "keep-all" }}
          variant="h5"
          fontWeight={500}
        >
          To:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            overflowX: "auto",
            width: "100%",
          }}
        >
          <TextField
            autoComplete="false"
            sx={{ marginTop: "1rem" }}
            fullWidth
            label="Search in your friends.."
            value={findFriendValue}
            onChange={handleFindFriend}
          />
          {selectedFriends.length > 0 && (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                padding: "1rem",
                gap: "0.5rem",
              }}
            >
              {selectedFriendsLabel}
            </Box>
          )}
        </Box>
      </Box>
      <Divider sx={{ my: "1rem" }} />
      <Box
        sx={{
          height: "30vh",
          overflowY: "auto",
          display: "flex",
          gap: "0.5rem",
          flexDirection: "column",
        }}
      >
        {friends.length > 0 ? (
          allFriends
        ) : (
          <Typography variant="h6" color={theme.palette.neutral.medium}>
            User not found.
          </Typography>
        )}
      </Box>
      <Button
        fullWidth
        sx={{
          color: theme.palette.neutral.dark,
          background: theme.palette.primary.main,
          "&:hover": { backgroundColor: theme.palette.primary[300] },
          marginTop: "1rem",
        }}
        onClick={() => handleStartChat(selectedFriends)}
      >
        CHAT
      </Button>
    </Box>
  );
};

export default NewMessage;
