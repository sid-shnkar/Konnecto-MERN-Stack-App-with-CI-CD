/*
This is the Advertisement.tsx file inside the widgets folder, which is located inside the client folder.
It contains a React component responsible for rendering an advertisement.

1. Import Statements:
*/

import FlexBetween from "@/components/FlexBetween";
import { Box, CardMedia, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

/*
2. Type Definition:
The Props type is defined as an empty object, indicating that the Advertisement component does not expect any props.

*/

type Props = {};

const Advertisement = (props: Props) => {
  /*
3. Advertisement Component:
The Advertisement component is a functional component that renders an advertisement.

- Theme:
The `useTheme` hook from `@mui/material` is used to access the current theme.

  */
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.alt,
        p: "1rem 6%",
        borderRadius: "0.7rem",
      }}
    >
      <FlexBetween>
        <Typography
          variant="h5"
          fontWeight={500}
          color={theme.palette.neutral.dark}
        >
          Sponsored
        </Typography>
        <Typography
          variant="h6"
          fontWeight={500}
          color={theme.palette.neutral.medium}
        >
          Create Ad
        </Typography>
      </FlexBetween>
      <CardMedia
        component={"img"}
        src="/assets/react.svg"
        sx={{ borderRadius: "1rem", padding: "2rem" }}
      />
      <FlexBetween>
        <Typography
          variant="h6"
          fontWeight={500}
          color={theme.palette.neutral.dark}
        >
          React
        </Typography>
        <Link
          to={"https://react.dev/"}
          color={theme.palette.neutral.medium}
          target="_blank"
          style={{
            textDecoration: "none",
            color: theme.palette.primary.dark,
          }}
        >
          React Dev
        </Link>
      </FlexBetween>
      <Typography
        marginTop={"1rem"}
        variant="h6"
        color={theme.palette.neutral.medium}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
        laudantium repellat sit ex pariatur nemo error illo voluptates dicta
        fugiat animi quasi qui, ducimus a, quia, consequuntur reprehenderit ab
        dolores.
      </Typography>
    </Box>
  );

  /*

4. Return Statement:
- The component returns JSX, including a Box component that serves as the container for the advertisement.
- The Box component has styling applied using the `sx` prop, which allows for inline style definitions.
- Inside the Box component, there is a FlexBetween component that displays two Typography components side by side.
- The Typography components display the "Sponsored" text and the "Create Ad" text, respectively.
- Following the FlexBetween component, there is a CardMedia component that displays an image.
- The CardMedia component uses the "img" component and sets the image source using the `src` prop.
- Additional styling is applied to the CardMedia component using the `sx` prop.
- Below the CardMedia component, there is another FlexBetween component that displays a Typography component and a Link component.
- The Typography component displays the text "React".
- The Link component serves as a hyperlink and directs the user to the "https://react.dev/" URL.
- The Link component has styling applied using the `style` prop to modify the text color.
- Finally, there is a Typography component that displays a paragraph of text.

  */
};

export default Advertisement;

/*
5. Export Statement:
- The Advertisement component is exported as the default export.

*/