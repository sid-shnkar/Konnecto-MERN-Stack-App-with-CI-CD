import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Messages from "../widgets/Messages";
import ChatBox from "../widgets/ChatBox";
import { useEffect, useState } from "react";
import NewMessage from "../widgets/NewMessage";
import { useSelector } from "react-redux";
import { useCreateNewChatMutation, useVerifyTokenQuery } from "@/api";
import Loading from "@/components/Loading";
import { FriendInterface, StateInterface } from "@/api/types";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";

type Props = {};

// Define grid template areas for big screens
const chatGrid = `
"a b b b"
`;

// Define grid template areas for small screens
const chatGridSmall = `
"a"
"b"
`;

const ChatPage = (props: Props) => {
  const token = useSelector<StateInterface>(
    (state) => state.persistedReducer.token
  ) as string;

   // Fetch user data and verify token using an API query
  const { data, isLoading, isError } = useVerifyTokenQuery({
    skip: !token,
    force: true,
    queryKey: ["verifyToken", token],
  });

  // Create new chat mutation
  const [newChat] = useCreateNewChatMutation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string>("");

  useEffect(() => {
     // Reset state variables when the component is unmounted
    return () => {
      setShowNewMessage(false);
      setSelectedChat("");
    };
  }, []);

  const handleNewMessageDisplay = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleStartChat = async (selectedFriends: Array<FriendInterface>) => {
    if (selectedFriends.length > 0) {
      const selectedFriendsIds = selectedFriends.map((f) => f._id);
      const response = await newChat(selectedFriendsIds);
      setShowNewMessage(false);
      if ("data" in response) {
        setSelectedChat(response.data._id);
      }
    }
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return <Typography variant="h1">Error while fetching user data</Typography>;
  }

  return (
    <Box
      sx={{
        gridTemplateAreas: isSmallScreen ? chatGridSmall : chatGrid,
        display: "grid",
        gridTemplateColumns: isSmallScreen
          ? "repeat(1,minmax(40px,1fr))"
          : "repeat(4,minmax(60px,1fr))",
        gridTemplateRows: isSmallScreen
          ? "repeat(2,minmax(40px,1fr))"
          : "repeat(1,minmax(40px,1fr))",
        margin: "1rem",
        gap: "1rem",
      }}
      height={"80vh"}
    >
      {showNewMessage && (
        <Box
          onClick={() => setShowNewMessage(false)}
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(0,0,0,0.8)"
                : "rgba(255,255,255,0.9)",
            zIndex: 10,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NewMessage
            setShowMessage={setShowNewMessage}
            displayNewMessage={handleNewMessageDisplay}
            user={data?.user}
            handleStartChat={handleStartChat}
          />
        </Box>
      )}

      <Box sx={{ gridArea: "a", overflowY: "auto" }}>
        {/* Render the Messages component */}
        <Messages
          setSelectedChat={setSelectedChat}
          user={data?.user}
          setShowNewMessage={setShowNewMessage}
          selectedChat={selectedChat}
        />
      </Box>
      <Box sx={{ gridArea: "b" }}>
         {/* Conditionally render the ChatBox or a message when no chat is selected */}
        {selectedChat?.length > 0 ? (
          <ChatBox user={data?.user} selectedChat={selectedChat} />
        ) : (
          <Box
            sx={{
              backgroundColor: theme.palette.background.alt,
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <MapsUgcIcon sx={{ fontSize: "6rem" }} />
            <Typography variant="h4">Messages</Typography>
            <Typography variant="h6" color={theme.palette.neutral.medium}>
              Send message to your friend or create group chat
            </Typography>
            <Button onClick={() => setShowNewMessage(true)}>
              Send Message
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
