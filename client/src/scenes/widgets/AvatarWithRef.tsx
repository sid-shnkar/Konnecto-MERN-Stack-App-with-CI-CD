/*
This is the AvatarWithRef.tsx file inside the widgets folder, which is located inside the client folder.
It contains a React component that wraps the Avatar component and forwards the ref to it.

1. Import Statements:
*/


import { Avatar } from "@mui/material";
import React, { ForwardedRef, forwardRef } from "react";

type Props = {
  forwardedRef: ForwardedRef<HTMLDivElement>;
};

/*
2. Type Definition:
The Props type is defined as an object with a single property called "forwardedRef".
The "forwardedRef" property is of type ForwardedRef<HTMLDivElement>, which is a generic type provided by React.
*/


const AvatarWithRef = forwardRef<HTMLDivElement, Props>((props, ref) => {

  /*
  3. AvatarWithRef Component:
  The AvatarWithRef component is created using the "forwardRef" function from React.
  This function allows the component to receive a ref and pass it down to a child component.
  */
  const { forwardedRef, ...rest } = props;

  /*
  4. Component Implementation:
  The AvatarWithRef component receives the props and ref as arguments.
  Inside the component, object destructuring is used to extract the "forwardedRef" from the props.
  The rest of the props are captured using the spread operator and stored in the "rest" variable.
  */
  return <Avatar {...rest} ref={ref} />;
  /*
  5. Return Statement:
  The component returns the Avatar component with the "rest" props spread onto it.
  The ref is passed to the Avatar component using the "ref" prop.
  */
});

export default AvatarWithRef;
/*
6. Export Statement:
The AvatarWithRef component is exported as the default export.
*/