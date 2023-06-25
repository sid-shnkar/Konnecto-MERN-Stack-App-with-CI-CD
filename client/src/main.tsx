import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import authReducer from "@/state/index";
import socketReducer from "@/state/socketState";
// import socketStateReducer from "./state/socketState";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import { api } from "@/api/index";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

// Configuration for persisting the Redux store
const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);

// Configure and create the Redux store
export const store = configureStore({
  reducer: {
    persistedReducer, // Persisted reducer with the configured persistConfig
    [api.reducerPath]: api.reducer, // Reducer for API endpoints created with `createApi` from the `@reduxjs/toolkit/query` package
    socketReducer, // Reducer for socket-related state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware), // Middleware for handling API requests and caching with `@reduxjs/toolkit/query`
});

// Set up listeners for the API endpoints created with `createApi`
setupListeners(store.dispatch);

// Render the app to the DOM
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
