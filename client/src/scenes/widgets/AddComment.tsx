/*
This is the AddComment.tsx file inside the widgets folder, which is located inside the client folder.
It contains a React component responsible for adding a comment to a post.

1. Import Statements:
*/

import { usePostCommentMutation } from "@/api";
import FlexBetween from "@/components/FlexBetween";
import Loading from "@/components/Loading";
import { Button, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";


type Props = {
  postId: string;
  setNewCommentAdded(arg: boolean): void;
};

/*
2. Type Definition:
The Props type is defined to specify the expected props for the AddComment component.
It includes the postId (string) and a function setNewCommentAdded (with a boolean argument and void return type).

*/
const AddComment = (props: Props) => {
  const { postId, setNewCommentAdded } = props;
  const [postComment, { isLoading }] = usePostCommentMutation();
  const [commentValue, setCommentValue] = useState<string>("");
  const handleTextChane = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentValue(e.currentTarget.value);
  };
  const handlePostComment = async () => {
    const correctForm = new URLSearchParams({
      text: commentValue,
    }).toString();
    await postComment({ postId, correctForm });
    setCommentValue("");
    setNewCommentAdded(true);
    setTimeout(() => {
      setNewCommentAdded(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      setCommentValue("");
    };
  }, []);

  if (isLoading) return <Loading />;

  return (
    <FlexBetween marginTop={"0.5rem"}>
      <TextField
        autoComplete="false"
        placeholder="make a comment.."
        fullWidth
        value={commentValue}
        onChange={handleTextChane}
      />
      <Button
        onClick={handlePostComment}
        disabled={commentValue.length > 0 ? false : true}
      >
        Share
      </Button>
    </FlexBetween>
  );
};

/*

3. AddComment Component:
The AddComment component is a functional component that renders the comment input and submit button.

- Props Destructuring:
The component destructures the postId and setNewCommentAdded function from the props parameter.

- State and Mutation:
- The `usePostCommentMutation` hook is used to handle the API mutation for posting a comment.
  - It returns the mutation function and a loading state.
- The `commentValue` state is initialized using the `useState` hook and represents the value of the comment input field.

- Event Handlers:
- The `handleTextChane` function is an event handler that updates the `commentValue` state with the current value of the comment input field.
- The `handlePostComment` function is an asynchronous event handler that handles the submission of the comment.
  - It constructs the correct form for the API request by creating a URLSearchParams object with the comment text.
  - It calls the `postComment` mutation function, passing the postId and the correct form.
  - After a successful comment submission, it resets the commentValue state, sets the new comment added flag using the `setNewCommentAdded` function, and resets the flag after a timeout of 2000ms.

- useEffect:
- The `useEffect` hook is used to clean up the commentValue state when the component is unmounted.
- It returns a cleanup function that resets the commentValue state.

- Loading State:
- If the `isLoading` state is true, it renders the Loading component.

4. Return Statement:
- The component returns JSX, including a FlexBetween component to display the comment input field and submit button.
- The TextField component represents the comment input field, with properties such as autoComplete, placeholder, fullWidth, value, and onChange.
- The Button component represents the submit button, with an onClick event handler to call `handlePostComment`.
- The button is disabled if the commentValue length is 0.
*/

export default AddComment;


/*
5. Export Statement:
- The AddComment component is exported as the default export.
*/