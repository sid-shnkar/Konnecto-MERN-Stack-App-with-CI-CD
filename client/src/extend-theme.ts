//eslint-disable-next-line
import { Palette,TypeBackground,PaletteColor } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    neutral: {
      dark: string;
      main: string;
      mediumMain: string;
      medium: string;
      light: string;
    };
  }
  interface TypeBackground {
    alt: string;
  }
  interface PaletteColor {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }
}

/* This code is called module augmentation and it is used to extend an existing module or library without modifying its original code. In this case, it is extending the Palette interface provided by the Material-UI library to add the neutral property with the specified color values.

When we use this code, the Palette interface provided by Material-UI is augmented with your custom neutral property, allowing you to use it in your theme object without TypeScript throwing an error. */
