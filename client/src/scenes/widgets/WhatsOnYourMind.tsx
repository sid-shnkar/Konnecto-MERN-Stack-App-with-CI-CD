import FlexBetween from "@/components/FlexBetween";  // Custom component
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"; // Material-UI components
import Dropzone from "react-dropzone"; // React component for file dropzone functionality
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"; // Material-UI icon component
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone"; // Material-UI icon component
import ImageIcon from "@mui/icons-material/Image"; // Material-UI icon component
import GifIcon from "@mui/icons-material/Gif"; // Material-UI icon component
import AttachFileIcon from "@mui/icons-material/AttachFile";  // Material-UI icon component
import MicIcon from "@mui/icons-material/Mic"; // Material-UI icon component
import React, { useEffect, useState } from "react"; // React core components
import { UserInterface } from "@/api/types";  // Custom types
import { usePostPostMutation } from "@/api"; // Custom API mutation hook
import Loading from "@/components/Loading"; // Custom component for loading state

type Props = {
  user?: UserInterface;
  setNewPostAdded(arg0: boolean): void;
};

const WhatsOnYourMind = (props: Props) => {
  const { user, setNewPostAdded } = props;
  const imageSize = "60px";
  const theme = useTheme(); // Material-UI hook for accessing theme
  const [picture, setPicture] = useState<File>(); // State for storing the selected picture file
  const [showDropZone, setShowDropZone] = useState(false); // State for controlling the visibility of the dropzone area
  const [postText, setPostText] = useState(""); // State for storing the post text
  const [post, isLoading] = usePostPostMutation(); // Custom API mutation hook for posting a new post

  useEffect(() => {
    return () => {
      setPicture(undefined);
      setShowDropZone(false);
      setPostText("");
    };
  }, []);

  const handlePostTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.currentTarget.value;
    setPostText(newText);
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", user?._id || "");
    formData.append("description", postText);
    if (picture) {
      formData.append("picturePath", picture);
    }
    setNewPostAdded(true);
    const response = await post(formData);
    if ("data" in response) {
      setPostText("");
      setShowDropZone(false);
      setPicture(undefined);
    }
    setTimeout(() => {
      setNewPostAdded(false);
    }, 5000);
  };

  return !isLoading ? (
    <Loading />
  ) : (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        padding: "1rem 6%",
        borderRadius: "0.7rem",
      }}
    >
      <FlexBetween gap={"1rem"}>
        <Avatar
          sx={{ height: imageSize, width: imageSize }}
          src={
            user && user?.picturePath.length > 0
              ? `${import.meta.env.VITE_BASE_URL}/assets/${user?.picturePath}`
              : "/assets/react.svg"
          }
        />
        <TextField
          autoComplete="false"
          value={postText}
          onChange={handlePostTextChange}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "2rem",
              backgroundColor: theme.palette.neutral.light,
              py: "0.3rem",
              px: "1rem",
            },
          }}
          placeholder="What's on your mind..."
        />
      </FlexBetween>
      <Divider sx={{ marginY: "1rem" }} />
      {showDropZone && (
        <Box>
          <FlexBetween>
            <Dropzone
              accept={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
              }}
              multiple={false}
              onDrop={(acceptedFiles) => setPicture(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  width={"100%"}
                  {...getRootProps()}
                  border={`2px dashed ${theme.palette.primary.main}`}
                  p="1rem"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!picture ? (
                    <p>Add Picture Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{picture.name}</Typography>
                      <EditOutlinedIcon />
                    </FlexBetween>
                  )}
                </Box>
              )}
            </Dropzone>
            {picture && (
              <IconButton onClick={() => setPicture(undefined)}>
                <DeleteForeverTwoToneIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            )}
          </FlexBetween>
          <Divider sx={{ marginY: "1rem" }} />
        </Box>
      )}
      <FlexBetween>
        <FlexBetween gap={"0.3rem"}>
          <ImageIcon />
          <Typography
            onClick={() => setShowDropZone((prev) => !prev)}
            variant="h6"
            sx={{ cursor: "pointer" }}
          >
            Image
          </Typography>
        </FlexBetween>
        <FlexBetween gap={"0.3rem"}>
          <GifIcon />
          <Typography variant="h6">Clip</Typography>
        </FlexBetween>
        <FlexBetween gap={"0.3rem"}>
          <AttachFileIcon />
          <Typography variant="h6">Attachment</Typography>
        </FlexBetween>
        <FlexBetween gap={"0.3rem"}>
          <MicIcon />
          <Typography variant="h6">Audio</Typography>
        </FlexBetween>
      </FlexBetween>
      <Divider sx={{ marginY: "1rem" }} />
      <Box display={"flex"} justifyContent={"center"}>
        <Button
          fullWidth
          sx={{
            color: theme.palette.primary.light,
            background: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.primary[300] },
            borderRadius: "1rem",
            fontSize: "0.8rem",
          }}
          disabled={postText.length > 0 ? false : true}
          onClick={handlePost}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default WhatsOnYourMind;
