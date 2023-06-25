import { useGetPostCommentsQuery } from "@/api"; // Importing the useGetPostCommentsQuery hook from the API module
import Loading from "@/components/Loading"; // Importing the Loading component
import Comment from "./Comment"; // Importing the Comment component
import { Box, Divider, Typography } from "@mui/material"; // Importing Box, Divider, and Typography components from the MUI library
import { useEffect, useRef, useState } from "react"; // Importing useEffect, useRef, and useState hooks from React
import { CommentInterface } from "@/api/types"; // Importing the CommentInterface type from the API module
type Props = {
  postId: string;
  userId?: string;
  newCommentAdded: boolean;
};

const Comments = (props: Props) => {
  const { postId, userId, newCommentAdded } = props;
  const [page, setPage] = useState<number>(1); // State variable to keep track of the current page
  const limit = 7; // Maximum number of comments to fetch per page
  const loadMoreRef = useRef<HTMLDivElement>(null); // Reference to the "Load More" element
  const [commentsState, setCommentsState] = useState<Array<CommentInterface>>(
    [] // State variable to store the comments
  );
  const { data, isLoading, isFetching } = useGetPostCommentsQuery({
    postId,
    page: newCommentAdded ? 1 : page,
    limit,
  }); // Fetching comments using the useGetPostCommentsQuery hook

  useEffect(() => {
    return () => {
      setPage(1); // Resetting the page number when the component is unmounted
      setCommentsState([]); // Clearing the comments state when the component is unmounted
    };
  }, []);

  useEffect(() => {
    if (data?.comments.comments) {
      setCommentsState((prev) => {
        const updatedComments = data?.comments.comments.map((comment) => {
          const index = prev.findIndex((c) => c._id === comment._id);
          if (index !== -1 && prev[index].updatedAt === comment.updatedAt) {
            return prev[index]; // Preserve the previous comment if it hasn't been updated
          }
          return comment; // Otherwise, return the updated comment
        });
        return [
          ...prev.filter(
            (c) =>
              !data.comments.comments.some((comment) => comment._id === c._id)
          ), // Remove deleted comments from the state
          ...updatedComments, // Add the updated comments to the state
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); // Sort the comments by createdAt timestamp in descending order
      });
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (
        target.isIntersecting && // Check if the "Load More" element is intersecting the viewport
        !isFetching && // Check if there are no ongoing fetch requests
        data?.totalComments && // Check if the total number of comments is available
        commentsState.length < data?.totalComments && // Check if there are more comments to load
        !newCommentAdded // Check if a new comment has not been added recently
      ) {
        setPage((prevPage) => prevPage + 1); // Increment the page number to load more comments
      }
    });

    const loadMoreNode = loadMoreRef.current;
    if (loadMoreNode) {
      observer.observe(loadMoreNode); // Observe the "Load More" element for intersection
    }
    return () => {
      if (loadMoreNode) {
        observer.unobserve(loadMoreNode); // Stop observing the "Load More" element when the component is unmounted
      }
    };
  }, [data?.totalComments, isFetching, commentsState.length, newCommentAdded]);

  if (isLoading) return <Loading />; // Render the Loading component while fetching comments

  const comments = commentsState.map((comment) => {
    return <Comment key={comment._id} userId={userId} comment={comment} />; // Render the Comment component for each comment
  });

  return (
    <Box
      my={"1rem"}
      pr={"1rem"}
      display={"flex"}
      flexDirection={"column"}
      gap={"0.5rem"}
      sx={{
        overflowY: "auto",
      }}
      maxHeight={"30vh"}
    >
      {comments && comments.length > 0 ? (
        <>
          {comments} <Box ref={loadMoreRef}></Box> {/* Render the comments and the "Load More" element */}
        </>
      ) : (
        <Typography>No comments yet..</Typography> // Render a message when there are no comments
      )}
      <Divider />  {/* Render a divider */}
    </Box>
  );
};

export default Comments;
