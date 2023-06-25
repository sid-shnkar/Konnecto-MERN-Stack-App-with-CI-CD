import { Box, CircularProgress } from "@mui/material";
import React from "react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <Box
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >

      {/* Render a circular progress indicator */}
      <CircularProgress size={"4rem"} />
    </Box>
  );
};

export default Loading;
