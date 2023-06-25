import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  PaletteMode,
  CssBaseline,
} from "@mui/material";
import { themeSettings } from "./theme";
import HomePage from "@/scenes/homePage";
import ProfilePage from "./scenes/profilePage";
import LoginPage from "@/scenes/loginPage/";
import { useDispatch, useSelector } from "react-redux";
import { StateInterface } from "@/api/types";
import { useEffect, useMemo, useState } from "react";
import { useVerifyTokenQuery } from "./api";
import Navbar from "./scenes/navbar";
import ChatPage from "./scenes/chatPage";
import Loading from "./components/Loading";
import { disconnetSocket, initSocket } from "./socket/socket";
import { setLogout } from "./state";

function App() {
  // Select the theme mode from the Redux store
  const mode = useSelector<StateInterface>(
    (state) => state.persistedReducer.mode
  ) as PaletteMode;

   // Create the theme based on the selected mode
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  // State for tracking login status
  const [isLogged, setIsLogged] = useState(false);

  // Select the token from the Redux store
  const token = useSelector<StateInterface>(
    (state) => state.persistedReducer.token
  ) as string;

  // Use the `useVerifyTokenQuery` hook to verify the token
  const { data, isLoading } = useVerifyTokenQuery({
    skip: !token,
  });

  // Access the Redux store's dispatch function
  const dispatch = useDispatch();

  // Handle effects when token or verification data change
  useEffect(() => {
    if (token && token.length > 0) {
      const bool = data?.user !== null;
      setIsLogged(bool);
      initSocket(token);
    } else {
      setIsLogged(false);
      disconnetSocket();
    }
    return () => {
      setIsLogged(false);
      disconnetSocket();
    };
  }, [token, data]);

  // Handle effect for logging out when the storage event occurs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "persist:root") {
        dispatch(setLogout());
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [dispatch]);

  // Render the Loading component while verifying the token
  if (isLoading) return <Loading />;

  // Render the main application components
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={isLogged ? <HomePage /> : <LoginPage />} />
            <Route
              path="/profile/:userId"
              element={isLogged ? <ProfilePage /> : <LoginPage />}
            />
            <Route
              path="/chat"
              element={isLogged ? <ChatPage /> : <LoginPage />}
            />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
