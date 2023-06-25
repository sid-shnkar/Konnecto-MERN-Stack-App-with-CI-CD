import { CommentInterface } from "@/api/types";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useGetUserQuery, useLikeCommentMutation } from "@/api";
import Loading from "@/components/Loading";

type Props = {
  comment: CommentInterface;
  userId?: string;
};

const Comment = (props: Props) => {
  const { comment, userId } = props;
  const { data, isLoading } = useGetUserQuery(comment.userId); // Fetches user data based on the comment's userId
  const theme = useTheme(); // Accesses the current theme of the application
  const [likeDislikeComment] = useLikeCommentMutation(); // Mutation hook for handling like/dislike operations
  const handleLikeDislikeComment = async () => {
    await likeDislikeComment(comment._id); // Likes or dislikes the comment using the likeDislikeComment mutation
  };

  if (isLoading) return <Loading />; // Displays a loading indicator while fetching user data

  return (
    <Box
      width={"100%"}
      display={"flex"}
      alignItems={"start"}
      justifyContent={"space-between"}
    >
      <Box display={"flex"} gap={"1rem"}>
        <Avatar
          src={
            data.picturePath.length > 0
              ? `${import.meta.env.VITE_BASE_URL}/assets/${data.picturePath}`
              : "/assets/react.svg"
          }
        />
        <Box display={"flex"} gap={"0.5rem"}>
          <Typography>
            <span style={{ fontWeight: 700 }}>
              {data.firstName} {data.lastName} {/* Displays the user's first name and last name */}
            </span>
            {` ${comment.text}`} {/* Displays the comment text */}
          </Typography>
        </Box>
      </Box>
      <Box display={"flex"} alignItems={"center"}>
        <IconButton onClick={handleLikeDislikeComment}>
          <FavoriteBorderOutlinedIcon
            sx={{
              color:
                userId && userId in comment.likes
                  ? theme.palette.primary.main
                  : "",
            }}
          />
        </IconButton>
        <Typography>{Object.keys(comment.likes).length}</Typography> {/* Displays the number of likes */}
      </Box>
    </Box>
  );
};

export default Comment;
