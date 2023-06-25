import FlexBetween from "@/components/FlexBetween"; // Importing the FlexBetween component
import {
  Avatar,
  Box,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material"; // Importing components and hooks from the MUI library
import PersonAddIcon from "@mui/icons-material/PersonAdd"; // Importing the PersonAddIcon component
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"; // Importing the ShareOutlinedIcon component
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined"; // Importing the FavoriteBorderOutlinedIcon component
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined"; // Importing the ChatBubbleOutlineOutlinedIcon component
import {
  useAddFriendMutation,
  useLikeDislikePostMutation,
  useVerifyTokenQuery,
} from "@/api"; // Importing mutation and query hooks from the API module
import { useSelector } from "react-redux"; // Importing the useSelector hook from react-redux
import { GetPostInterface, StateInterface } from "@/api/types"; // Importing types from the API module
import Comments from "./Comments"; // Importing the Comments component
import { Link } from "react-router-dom"; // Importing the Link component from react-router-dom
import { useEffect, useState } from "react"; // Importing useEffect and useState hooks from React
import AddComment from "./AddComment"; // Importing the AddComment component
import getTimeDiff from "@/utils/getTimeDiff"; // Importing the getTimeDiff utility function

type Props = {
  post: GetPostInterface;
};

const Feed = (props: Props) => {
  const { post } = props;
  const token = useSelector<StateInterface>(
    (state) => state.persistedReducer.token
  ) as string; // Accessing the token from the Redux store
  const imageSize = "50px";
  const theme = useTheme(); // Accessing the current theme from MUI
  const [like] = useLikeDislikePostMutation(); // Mutation hook for liking/disliking a post
  const [addFriend] = useAddFriendMutation(); // Mutation hook for adding a friend
  const { data } = useVerifyTokenQuery({
    skip: !token,
    queryKey: ["verifyToken", token],
    // set force to true to force a fresh query fetch
    force: true,
  }); // Query hook for verifying the token
  const [newCommentAdded, setNewCommentAdded] = useState(false); // State variable to track new comment additions
  const [showComments, setShowComments] = useState(false); // State variable to toggle comment visibility
  const isUserOwnPost = token && post.userId === data?.user._id;  // Checking if the user owns the post
  const isAlreadyFriend = token && data?.user.friends.includes(post.userId); // Checking if the user is already a friend

  useEffect(() => {
    return () => {
      setNewCommentAdded(false); // Resetting the new comment state when the component is unmounted
      setShowComments(false);   // Resetting the show comments state when the component is unmounted
    };
  }, []);

  const handleLike = async () => {
    await like(post._id); // Liking/disliking a post using the like mutation
  };

  const handleAddFriend = async () => {
    await addFriend(`${data?.user._id}/${post.userId}`); // Adding a friend using the addFriend mutation
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        padding: "1rem 6%",
        borderRadius: "0.7rem",
      }}
    >
      <FlexBetween>
        <Box display={"flex"} gap={"0.7rem"}>
          <Avatar
            src={
              post.userPicturePath.length > 0
                ? `${import.meta.env.VITE_BASE_URL}/assets/${
                    post.userPicturePath
                  }`
                : "/assets/react.svg"
            }
            sx={{ height: imageSize, width: imageSize }}
          />
          <Box>
            <Link
              to={`/profile/${post.userId}`}
              style={{
                fontWeight: 500,
                textDecoration: "none",
                color: theme.palette.primary.dark,
                fontSize: "1.4rem",
              }}
            >
              {post.firstName} {post.lastName}
            </Link>
            <Typography
              fontWeight={500}
              color={theme.palette.neutral.medium}
              variant="h6"
            >
              {post.location} - {getTimeDiff(post.createdAt)}
            </Typography>
          </Box>
        </Box>
        {!isUserOwnPost && !isAlreadyFriend && (
          <IconButton onClick={handleAddFriend}>
            <PersonAddIcon />
          </IconButton>
        )}
      </FlexBetween>
      <Box sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
        <Typography sx={{ p: "1rem" }}>{post.description}</Typography>
      </Box>
      {post.picturePath.length > 0 && (
        <CardMedia
          component="img"
          src={`${import.meta.env.VITE_BASE_URL}/assets/${post.picturePath}`}
          sx={{ borderRadius: "1rem" }}
        />
      )}
      <FlexBetween my={"1rem"}>
        <Box display={"flex"} gap={"1.5rem"}>
          <Box display={"flex"} alignItems={"center"}>
            <IconButton onClick={handleLike}>
              <FavoriteBorderOutlinedIcon
                sx={{
                  fontSize: "24px",
                  color:
                    data && data.user._id in post.likes
                      ? theme.palette.primary.main
                      : "",
                }}
              />
            </IconButton>
            <Typography variant="h6">
              {Object.keys(post.likes).length}
            </Typography>
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <IconButton onClick={() => setShowComments(!showComments)}>
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: "24px" }} />
            </IconButton>
            <Typography variant="h6">{post.comments.length}</Typography>
          </Box>
        </Box>
        <IconButton>
          <ShareOutlinedIcon />
        </IconButton>
      </FlexBetween>
      <Divider />
      {showComments && (
        <Comments
          newCommentAdded={newCommentAdded}
          postId={post._id}
          userId={data?.user._id}
        />
      )}
      <AddComment setNewCommentAdded={setNewCommentAdded} postId={post._id} />
    </Box>
  );
};

export default Feed;
