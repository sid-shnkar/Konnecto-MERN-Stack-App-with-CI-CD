import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Profile from "../widgets/Profile";
import { useVerifyTokenQuery } from "@/api";
import WhatsOnYourMind from "../widgets/WhatsOnYourMind";
import Feeds from "../widgets/Feeds";
import { useSelector } from "react-redux";
import { StateInterface } from "@/api/types";
import Advertisement from "../widgets/Advertisement";
import Friends from "../widgets/Friends";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

// Define grid template areas for big screens
const HomePageGridBigScreen = `
"a a b b b c c"
`;

// Define grid template areas for small screens
const HomePageGridSmallScreen = `
"a"
"c"
"b"
`;

const HomePage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Retrieve token from Redux store
  const token = useSelector<StateInterface>(
    (state) => state.persistedReducer.token
  ) as string;
  const [newPostAdded, setNewPostAdded] = useState(false);

  // Fetch user data and verify token using an API query
  const { data, isLoading, isError } = useVerifyTokenQuery({
    skip: !token,
    queryKey: ["verifyToken", token],
    // set force to true to force a fresh query fetch
    force: true, // Force a fresh query fetch
  });

  useEffect(() => {
    // Reset newPostAdded state when the component is unmounted
    return () => {
      setNewPostAdded(false);
    };
  }, []);

  if (isLoading) return <Loading />;
  if (isError)
    return <Typography variant="h1">Error when fetching user data</Typography>;

  return (
    <>
      <Box
        sx={
          !isSmallScreen
            ? {
                display: "grid",
                gridTemplateAreas: HomePageGridBigScreen,
                gridTemplateRows: "repeat(1,minmax(40px,1fr))",
                gridTemplateColumns: "repeat(7,minmax(40px,1fr))",
              }
            : {
                display: "grid",
                gridTemplateAreas: HomePageGridSmallScreen,
                gridTemplateRows: "repeat(1,minmax(40px,1fr))",
                gridTemplateColumns: "repeat(1,minmax(40px,1fr))",
              }
        }
        height={"100%"}
        p={"1rem 6%"}
        gap={"2rem"}
      >
        <Box gridArea={"a"}>
          <Profile user={data && data?.user} isOwner={true} />
        </Box>

        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={"1rem"}
          gridArea={"b"}
        >
          <WhatsOnYourMind
            setNewPostAdded={setNewPostAdded}
            user={data?.user}
          />
          <Feeds newPostAdded={newPostAdded} />
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={"1rem"}
          gridArea={"c"}
        >
          <Advertisement />
          <Friends userId={data?.user._id} isOwner={true} />
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
