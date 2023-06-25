/*
This is the socket.ts file inside the socket folder.
It contains functions related to socket.io integration with a React application.

1. Import Statements:
*/
import { store } from "@/main";
import { setActiveUsers } from "@/state/socketState";
import { io, Socket } from "socket.io-client";

/*
2. Global Socket Variable:
The socket variable is declared as a global variable of type Socket from the socket.io-client library.
It will be used to establish and manage the socket connection.

*/
export let socket: Socket;

export const initSocket = (token: string) => {
  socket = io(import.meta.env.VITE_BASE_URL, { query: { token } });
  socket.on("connect", () => {
    console.log("connected to server");
  });

  socket.on("activeUsers", (data) => {
    store.dispatch(setActiveUsers(data));
  });

  socket.on("notifications", (data) => {
    console.log(data);
  });

  socket.emit("userLogged");
  socket.emit("listenActiveUsers");
};


/*
3. initSocket Function:
The initSocket function is responsible for initializing the socket connection.
It takes a token parameter, which is a string representing the user token.

- Inside the function:
- The socket variable is assigned the result of calling the io function from the socket.io-client library.
  - The first argument is `import.meta.env.VITE_BASE_URL`, which is the base URL of the server.
  - The second argument is an options object with a `query` property, including the token for authentication.

- Event Listeners:
- The socket.on("connect", ...) registers an event listener for the "connect" event, which is triggered when the socket connection is established.
  - It logs a message to the console indicating that the client is connected to the server.

- The socket.on("activeUsers", ...) registers an event listener for the "activeUsers" event, which is triggered when the server sends the list of active users.
  - It dispatches the setActiveUsers action from the socket state slice, passing the received data.

- The socket.on("notifications", ...) registers an event listener for the "notifications" event, which is triggered when the server sends notifications.
  - It logs the received data to the console.

- Socket Emit:
- The socket.emit("userLogged") sends a "userLogged" event to the server, indicating that a user has logged in.
- The socket.emit("listenActiveUsers") sends a "listenActiveUsers" event to the server, requesting the list of active users.

*/
export const disconnetSocket = () => {
  if (socket) {
    console.log("disconnected from server");
    socket.disconnect();
  }
};

/*

4. disconnectSocket Function:
The disconnectSocket function is responsible for disconnecting the socket from the server.

- Inside the function:
- It checks if the socket variable is defined.
- If it is, it logs a message to the console indicating that the client is disconnected from the server and calls the `disconnect` method of the socket to disconnect it.

*/

/*

5. Export Statements:
- The `socket` variable is exported to be accessible from other parts of the application.
- The `initSocket` and `disconnectSocket` functions are also exported to be used for socket initialization and disconnection.

*/