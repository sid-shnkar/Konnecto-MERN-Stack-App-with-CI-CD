import FlexBetween from "@/components/FlexBetween"; // Importing the FlexBetween component from the "@/components/FlexBetween" file.
import { UserInterface } from "@/api/types"; // Importing the UserInterface from the "@/api/types" file.
import { Avatar, Box, Divider, Typography, useTheme } from "@mui/material";  // Importing various components from the "@mui/material" library.
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts"; // Importing the ManageAccountsIcon from the "@mui/icons-material" library.
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"; // Importing the LocationOnOutlinedIcon from the "@mui/icons-material" library.
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined"; // Importing the WorkOutlineOutlinedIcon from the "@mui/icons-material" library.
import TwitterIcon from "@mui/icons-material/Twitter"; // Importing the TwitterIcon from the "@mui/icons-material" library.
import LinkedInIcon from "@mui/icons-material/LinkedIn"; // Importing the LinkedInIcon from the "@mui/icons-material" library.
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone"; // Importing the EditTwoToneIcon from the "@mui/icons-material" library.
import { Link } from "react-router-dom";  // Importing the Link component from the "react-router-dom" library.

type Props = {
  user?: UserInterface; // Defining the user prop with the UserInterface type.
  isOwner: boolean;   // Defining the isOwner prop as a boolean.
};

const Profile = (props: Props) => {
  const { user, isOwner } = props; // Destructuring the props object to obtain user and isOwner.
  const theme = useTheme(); // Accessing the current theme using the useTheme hook from Material-UI.
  const imageSize = "60px"; // Defining the size of the image.

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        p: "1rem 6%",
        borderRadius: "0.7rem",
      }}
    >
      <FlexBetween>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Avatar
            src={
              user && user?.picturePath.length > 0
                ? `${import.meta.env.VITE_BASE_URL}/assets/${user?.picturePath}`
                : "/assets/react.svg"
            }
            alt={user?.picturePath}
            sx={{ height: imageSize, width: imageSize }}
          />
          <Box>
            <Link
              to={`/profile/${user?._id}`}
              style={{
                fontWeight: 500,
                textDecoration: "none",
                color: theme.palette.primary.dark,
                fontSize: "1.4rem",
              }}
            >
              {user?.firstName} {user?.lastName}
            </Link>
            <Typography variant="h6" color={theme.palette.neutral.main}>
              {user?.friends.length} friends
            </Typography>
          </Box>
        </Box>
        <ManageAccountsIcon sx={{ fontSize: "25px" }} />
      </FlexBetween>
      <Divider sx={{ margin: "1rem 0" }} />
      <Box>
        <Box display={"flex"} alignItems={"center"} gap={"1rem"}>
          <LocationOnOutlinedIcon sx={{ fontSize: "35px" }} />
          <Typography variant="h5" color={theme.palette.neutral.main}>
            {user?.location}
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"} gap={"1rem"}>
          <WorkOutlineOutlinedIcon sx={{ fontSize: "35px" }} />
          <Typography variant="h5" color={theme.palette.neutral.main}>
            {user?.occupation}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ margin: "1rem 0" }} />
      {isOwner && (
        <Box>
          {" "}
          <Box display={"flex"} gap={"1rem"} flexDirection={"column"}>
            <FlexBetween>
              <Typography variant="h6" color={theme.palette.neutral.mediumMain}>
                Who's viewed your profile
              </Typography>
              <Typography
                variant="h5"
                fontWeight={500}
                color={theme.palette.neutral.main}
              >
                {user?.viewedProfile}
              </Typography>
            </FlexBetween>
            <FlexBetween>
              <Typography variant="h6" color={theme.palette.neutral.mediumMain}>
                Impressions of your post
              </Typography>
              <Typography
                variant="h5"
                fontWeight={500}
                color={theme.palette.neutral.main}
              >
                {user?.impressions}
              </Typography>
            </FlexBetween>
          </Box>
          <Divider sx={{ margin: "1rem 0" }} />
        </Box>
      )}

      <Box display={"flex"} gap={"1rem"} flexDirection={"column"}>
        <Typography
          variant="h5"
          fontWeight={700}
          color={theme.palette.neutral.main}
        >
          Social Profiles
        </Typography>
        <FlexBetween>
          <Box display={"flex"} alignItems={"center"} gap={"1rem"}>
            <TwitterIcon sx={{ fontSize: "35px" }} />
            <Box>
              <Typography
                fontWeight={500}
                color={theme.palette.neutral.main}
                variant="h5"
              >
                Twitter
              </Typography>
              <Typography
                fontWeight={500}
                color={theme.palette.neutral.medium}
                variant="h6"
              >
                Social Network
              </Typography>
            </Box>
          </Box>
          <EditTwoToneIcon sx={{ fontSize: "25px" }} />
        </FlexBetween>
        <FlexBetween>
          <Box display={"flex"} alignItems={"center"} gap={"1rem"}>
            <LinkedInIcon sx={{ fontSize: "35px" }} />
            <Box>
              <Typography
                fontWeight={500}
                color={theme.palette.neutral.main}
                variant="h5"
              >
                Linkedin
              </Typography>
              <Typography
                fontWeight={500}
                color={theme.palette.neutral.medium}
                variant="h6"
              >
                Network Platform
              </Typography>
            </Box>
          </Box>
          <EditTwoToneIcon sx={{ fontSize: "25px" }} />
        </FlexBetween>
      </Box>
    </Box>
  );
};

export default Profile;
