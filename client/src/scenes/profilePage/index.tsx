import { useGetUserQuery, useVerifyTokenQuery } from "@/api";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import Profile from "../widgets/Profile";
import Friends from "../widgets/Friends";
import Feeds from "../widgets/Feeds";
import WhatsOnYourMind from "../widgets/WhatsOnYourMind";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { StateInterface } from "@/api/types";
import Loading from "@/components/Loading";

const ProfilePageGridBigScreen = `
"a a b b b "
`;

const ProfilePage = () => {
  const { userId } = useParams();  // Accesses the user ID from the route parameters
  const { data: User, isLoading, isError } = useGetUserQuery(userId); // Fetches user data using the user ID
  const theme = useTheme(); // Retrieves the current MUI theme
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));  // Checks if the screen size is small
  const [isOwner, setIsOwner] = useState(false); // Tracks whether the current user is the owner of the profile
  const token = useSelector<StateInterface>(
    (state) => state.persistedReducer.token
  ) as string; // Retrieves the token from the Redux store
  const [newPostAdded, setNewPostAdded] = useState(false); // Tracks whether a new post has been added
  const { data: VerifyToken } = useVerifyTokenQuery({
    skip: !token, // Verifies the token's validity
  });

  useEffect(() => {
    return () => {
      setIsOwner(false); // Cleanup: Resets the isOwner state
      setNewPostAdded(false); // Cleanup: Resets the newPostAdded state
    };
  }, []);

  useEffect(() => {
    if (token) {
       // Checks if the token is present
      const bool = VerifyToken?.user._id === User?._id; // Compares the user ID from the token with the current user's ID
      setIsOwner(bool); // Updates the isOwner state based on the comparison result
    } else setIsOwner(false);
  }, [token, User, VerifyToken]);

  if (isLoading) {
    return <Loading />; // Renders a loading indicator while user data is being fetched
  }

  if (isError) {
    return (
      <Typography variant="h1">
        {" "}
        Error while fetching profile page user data..
      </Typography>
    ); // Renders an error message if there's an error while fetching user data
  }

  return (
    <Box
      sx={
        !isSmallScreen
          ? {
              display: "grid",
              gridTemplateAreas: ProfilePageGridBigScreen,
              gridTemplateRows: "repeat(1,minmax(40px,1fr))",
              gridTemplateColumns: "repeat(5,minmax(40px,1fr))",
              p: "1rem 10%",
            }
          : { display: "flex", flexDirection: "column" }
      }
    >
      <Box
        sx={{
          gridArea: "a",
          p: "1rem 6%",
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
        }}
      >
        <Profile user={User} isOwner={isOwner} />
        <Friends userId={User._id} isOwner={isOwner} />
      </Box>
      <Box
        sx={{
          gridArea: "b",
          p: "1rem 6%",
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
        }}
      >
        {isOwner && (
          <WhatsOnYourMind user={User} setNewPostAdded={setNewPostAdded} />
        )}
        <Feeds userId={User._id} newPostAdded={newPostAdded} />
      </Box>
    </Box>
  );
};

export default ProfilePage;
