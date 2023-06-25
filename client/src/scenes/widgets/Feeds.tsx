import { useGetFeedsQuery } from "@/api"; // Importing the useGetFeedsQuery hook from the API module
import { Box, Typography } from "@mui/material"; // Importing components from the MUI library
import Feed from "./Feed";  // Importing the Feed component
import Loading from "@/components/Loading"; // Importing the Loading component
import { useEffect, useRef, useState } from "react"; // Importing useEffect, useRef, and useState hooks from React
import { GetPostInterface } from "@/api/types"; // Importing types from the API module

type Props = {
  userId?: string;
  newPostAdded: boolean;
};

const Feeds = (props: Props) => {
  const { userId, newPostAdded } = props;
  const [page, setPage] = useState<number>(1);  // State variable to track the current page
  const limit = 12; // The maximum number of posts to fetch per page
  const [posts, setPosts] = useState<Array<GetPostInterface>>([]); // State variable to store the fetched posts
  const { data, isLoading, isError, isFetching } = useGetFeedsQuery({
    userId: userId || "",
    page: newPostAdded ? 1 : page,
    limit,
  }); // Query hook for fetching feeds

  const loadMoreRef = useRef<HTMLDivElement>(null);  // Reference to the load more div element

  useEffect(() => {
    return () => {
      setPosts([]); // Resetting the posts state when the component is unmounted
      setPage(1); // Resetting the page state when the component is unmounted
    };
  }, [userId]);

  useEffect(() => {
    if (data?.posts) {
      setPosts((prev) => {
        const updatedPosts = data.posts.map((post) => {
          const index = prev.findIndex((p) => p._id === post._id);
          if (index !== -1 && prev[index].updatedAt === post.updatedAt) {
            return prev[index];
          }
          return post;
        });
        return [
          ...prev.filter((p) => !data.posts.some((post) => post._id === p._id)),
          ...updatedPosts,
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        !isFetching &&
        data?.totalPosts &&
        posts.length < data?.totalPosts &&
        !newPostAdded
      ) {
        setPage((prevPage) => prevPage + 1); // Load more posts if the load more div is intersecting and conditions are met
      }
    });

    const loadMoreNode = loadMoreRef.current;

    if (loadMoreNode) {
      observer.observe(loadMoreNode); // Start observing the load more div
    }

    return () => {
      if (loadMoreNode) {
        observer.unobserve(loadMoreNode); // Stop observing the load more div when the component is unmounted
      }
    };
  }, [isFetching, posts.length, data?.totalPosts, newPostAdded]);

  if (isLoading) {
    return <Loading />; // Render the Loading component while the feeds are being fetched
  }

  if (isError) {
    return <Typography>Error fetching feeds.</Typography>; // Render an error message if there was an error fetching feeds
  }

  const feeds = posts.map((post) => {
    return <Feed key={post._id} post={post} />;  // Render the Feed component for each post
  });

  return (
    <Box display={"flex"} gap={"1rem"} flexDirection={"column"}>
      {feeds}
      <Box ref={loadMoreRef}>{isFetching ? <Loading /> : ""}</Box>
    </Box>
  );
};

export default Feeds;
