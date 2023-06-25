import { Box, Typography, useTheme } from "@mui/material"; // Importing components and hooks from the MUI library
import Friend from "./Friend"; // Importing the Friend component from the local file
import { useGetUserFriendsQuery } from "@/api"; // Importing the useGetUserFriendsQuery hook from the API module
import Loading from "@/components/Loading";   // Importing the Loading component from the local file
import NewBadge from "./NewBadge"; // Importing the NewBadge component from the local file

type Props = {
  userId?: string;
  isOwner: boolean;
};

const Friends = (props: Props) => {
  const { userId, isOwner } = props;
  const { data, isLoading, isError } = useGetUserFriendsQuery(userId || ""); // Query hook for fetching user friends
  const theme = useTheme(); // Hook for accessing the current theme

  if (isLoading) return <Loading />; // Display the Loading component while data is being fetched
  if (isError) {
    return (
      <Typography variant="h5">Error while fetching user friends..</Typography>
    ); // Display an error message if there was an error fetching user friends
  }

  const allFriends = data?.map((friend) =>
    isOwner ? (
      <NewBadge key={friend._id} userId={friend._id}>
        <Friend friend={friend} userId={userId || ""} isOwner={isOwner} />
      </NewBadge>
    ) : (
      <Friend
        key={friend._id}
        friend={friend}
        userId={userId || ""}
        isOwner={isOwner}
      />
    )
  ); // Render the Friend component for each friend in the data array, wrapping it with the NewBadge component if the user is the owner

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        display: "flex",
        flexDirection: "column",
        p: "1rem 6%",
        borderRadius: "0.7rem",
        gap: "1rem",
        maxHeight: "50vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h3" fontWeight={700}>
        {data?.length} Friends
      </Typography>
      {allFriends && allFriends.length > 0 ? (
        allFriends
      ) : (
        <Typography variant="h6">No friends yet..</Typography>
      )}
    </Box>
  );
};

export default Friends;
