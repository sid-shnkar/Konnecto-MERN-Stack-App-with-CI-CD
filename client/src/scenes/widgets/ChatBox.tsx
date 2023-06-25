/*
This is the ChatBox.tsx file inside the widgets folder, which is located inside the client folder.
It contains a React component that represents a chat box with messages and input field.

1. Import Statements:
*/

import { useGetSingleChatQuery } from "@/api";
import { MessageInterface, UserInterface } from "@/api/types";
import Loading from "@/components/Loading";
import {
  Avatar,
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket/socket";
import getTimeDiff from "@/utils/getTimeDiff";
import NewBadge from "./NewBadge";


/*
2. Type Definitions:
The Props type is defined as an object with two properties: "user" and "selectedChat".
The "user" property is of type UserInterface and represents the currently logged-in user.
The "selectedChat" property is of type string and represents the ID of the selected chat.
*/

type Props = {
  user?: UserInterface;
  selectedChat: string;
};

/*
3. ChatBox Component:
The ChatBox component is created using a functional component approach.

4. Component Implementation:
The ChatBox component receives the props as an argument and destructures the "user" and "selectedChat" from the props.
It also initializes some local state variables using the useState hook:
- "value": Stores the value of the input field.
- "data", "isLoading", "isFetching", "refetch": Variables returned by the useGetSingleChatQuery hook for fetching chat data.
- "messagesState": Stores an array of MessageInterface objects representing the chat messages.
- "chatBoxRef": Ref object used to scroll the chat box to the bottom.
*/

const ChatBox = (props: Props) => {
  const { user, selectedChat } = props;
  const navigate = useNavigate();
  const theme = useTheme();
  const [value, setValue] = useState("");
  const { data, isLoading, isFetching, refetch } =
    useGetSingleChatQuery(selectedChat);
  const [messagesState, setMessagesState] = useState<Array<MessageInterface>>(
    []
  );
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat.length > 0) {
      socket.emit("startChat", selectedChat);
      const handleSetMesage = (message: MessageInterface) => {
        setMessagesState((prev) => [...prev, message]);
      };
      socket.on("chat", handleSetMesage);
    }
    return () => {
      socket.off("chat");
      socket.emit("leaveRoom", selectedChat);
    };
  }, [selectedChat]);

  useEffect(() => {
    refetch();
  }, [refetch, selectedChat]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messagesState]);

  useEffect(() => {
    if (!isFetching && data) {
      setMessagesState(data?.messages);
    }
  }, [isFetching, data]);

  useEffect(() => {
    return () => {
      setMessagesState([]);
      setValue("");
    };
  }, []);

  /*
  5. useEffect Hooks:
  - The first useEffect hook is responsible for setting up and cleaning up the socket connection.
  - The second useEffect hook triggers the chat data refetch when the selected chat ID changes.
  - The third useEffect hook scrolls the chat box to the bottom whenever the messagesState updates.
  - The fourth useEffect hook updates the messagesState when the data fetching is complete.
  - The fifth useEffect hook is responsible for cleaning up the chat box state when the component unmounts.
  */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.length > 0) {
      socket.emit(
        "chat",
        { chatId: selectedChat, msg: value },
        (newMessage: MessageInterface) => {
          setMessagesState((prev) => [...prev, newMessage]);
        }
      );
      setValue("");
    }
  };

  /*
  6. handleSubmit Function:
  This function is called when the form is submitted.
  It prevents the default form submission behavior and emits a "chat" event to the server with the chat ID and the message value.
  When a new message is received from the server, it updates the messagesState with the new message and clears the input field.
  */

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  /*
  7. handleValueChange Function:
  This function is called when the input field value changes.
  It updates the "value" state variable with the new value.
  */

  if (isLoading) return <Loading />;

  /*
  8. Loading State:
  If the chat data is still loading, the component displays a Loading component.
  */

  const CreatedBy = () => {
    return (
      <Box
        display={"flex"}
        alignItems={"center"}
        gap={"0.2rem"}
        sx={{
          "&:hover": { color: theme.palette.primary.dark, cursor: "pointer" },
        }}
        onClick={() => navigate(`/profile/${data?.createdBy._id}`)}
      >
        <NewBadge userId={data?.createdBy._id}>
          <Avatar
            src={
              data && data?.createdBy.picturePath.length > 0
                ? `${import.meta.env.VITE_BASE_URL}/assets/${
                    data?.createdBy.picturePath
                  }`
                : "/assets/react.svg"
            }
          />
        </NewBadge>

        <Typography whiteSpace={"nowrap"} fontWeight={700}>
          {data?.createdBy.firstName} {data?.createdBy.lastName}
        </Typography>
      </Box>
    );
  };

  /*
  9. CreatedBy Component:
  This component displays information about the creator of the chat.
  It includes an Avatar, user's name, and a link to their profile.
  */

  const participants = data?.participants
    .filter((participant) => participant._id !== user?._id)
    .map((participant) => {
      return (
        <Box
          key={`${participant._id}+participant`}
          display={"flex"}
          alignItems={"center"}
          gap={"0.2rem"}
          sx={{
            "&:hover": { color: theme.palette.primary.dark, cursor: "pointer" },
          }}
          onClick={() => navigate(`/profile/${participant._id}`)}
        >
          <NewBadge userId={participant._id}>
            <Avatar
              src={
                participant.picturePath.length > 0
                  ? `${import.meta.env.VITE_BASE_URL}/assets/${
                      participant.picturePath
                    }`
                  : "/assets/react.svg"
              }
            />
          </NewBadge>

          <Typography whiteSpace={"nowrap"} fontWeight={700}>
            {participant.firstName} {participant.lastName}
          </Typography>
        </Box>
      );
    });

  /*
    10. Participants Component:
    This component displays information about the other participants in the chat.
    It includes an Avatar, participants' names, and links to their profiles.
  */

  const messages = messagesState?.map((message) => {
    return (
      <Box
        key={message?._id}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent:
            user && message.sender._id === user._id ? "flex-end" : "flex-start",
          gap: "0.3rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Avatar
          src={
            message.sender.picturePath?.length > 0
              ? `${import.meta.env.VITE_BASE_URL}/assets/${
                  message.sender.picturePath
                }`
              : "/assets/react.svg"
          }
          sx={{
            width: "2rem",
            height: "auto",
            "&:hover": { cursor: "pointer" },
          }}
          onClick={() => navigate(`/profile/${message.sender._id}`)}
          alt={message.sender.firstName}
        />

        <Box
          sx={{
            backgroundColor:
              user && message.sender._id === user._id
                ? theme.palette.primary.main
                : theme.palette.neutral.light,
            padding: "0.5rem 1rem",
            maxWidth: "50%",
            width: "fit-content",
            borderRadius: "1rem",
          }}
        >
          {data?.participants.length !== 1 && (
            <>
              <Typography
                variant="h6"
                sx={{ fontSize: "0.8rem", fontWeight: 700 }}
              >
                {message.sender.firstName} {message.sender.lastName}
              </Typography>
              <Divider sx={{ marginBottom: "0.5rem" }} />
            </>
          )}
          <Typography sx={{ wordBreak: "break-word" }}>
            {message?.content}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: "10px",
              color: theme.palette.neutral.mediumMain,
              textAlign: "end",
            }}
          >
            {getTimeDiff(message?.createdAt)}
          </Typography>
        </Box>
      </Box>
    );
  });

  /*
  11. Messages:
  This variable maps over the messagesState array and generates the UI for each message.
  It includes the sender's Avatar, message content, and the timestamp.
  */

  return (
    <>
      <Box
        display={"flex"}
        gap={"0.8rem"}
        padding={"1rem"}
        sx={{ backgroundColor: theme.palette.primary.light, overflowY: "auto" }}
      >
        {user?._id !== data?.createdBy._id && <CreatedBy />}
        {participants}
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.background.alt,

          padding: "1rem",
          borderRadius: "0.7rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto",
        }}
      >
        <Box ref={chatBoxRef} sx={{ overflowY: "auto", height: "60vh" }}>
          {messages}
        </Box>

        <form
          onSubmit={handleSubmit}
          id="form"
          action=""
          style={{ marginTop: "1rem", display: "flex" }}
          autoComplete="false"
        >
          <TextField
            autoComplete="false"
            fullWidth
            onChange={handleValueChange}
            value={value}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="submit"
                    sx={{ mr: "auto" }}
                    disabled={value.length > 0 ? false : true}
                  >
                    Send
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Box>
    </>
  );

  /*
  12. Return Statement:
  The component returns a JSX fragment containing the UI elements for the chat box.
  - The Box component displays the information about the creator and participants.
  - The Box component contains the chat messages and the input form.
  - The form element handles the submission of new messages.
  - The TextField component represents the input field for entering messages.
  */
};

export default ChatBox;

/*
13. Export Statement:
The ChatBox component is exported as the default export.
*/