/*
This is the socketState.ts file inside the state folder.
It defines the Redux state slice for socket-related state using the createSlice function from the @reduxjs/toolkit library.

1. Import Statements:
*/

import { SocketStateInterface } from "@/api/types";
import { createSlice } from "@reduxjs/toolkit";

/*
2. Initial State:
The initialState variable defines the initial state of the socket slice.
It is an object of type SocketStateInterface, which represents the socket-related state.
*/

const initialState: SocketStateInterface = {
  activeUsers: [],
};

/*
3. Redux Slice Creation:
The createSlice function is used to create the socket slice.
It takes an object parameter with the following properties:
- name: The name of the slice.
- initialState: The initial state of the slice.
- reducers: An object that contains the reducer functions for updating the state.

The socketSlice variable holds the created slice object.
*/

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    /*
    - setActiveUsers: A reducer function that updates the activeUsers property of the state with the payload value.
    */
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
  },
});

/*
4. Action Creators:
The socketSlice.actions object contains the action creators generated by createSlice for the defined reducers.
In this case, it includes the setActiveUsers action creator.

5. Default Export:
The socketSlice.reducer is the default export of the module, representing the reducer function of the socket slice.
*/

export const { setActiveUsers } = socketSlice.actions;
export default socketSlice.reducer;
