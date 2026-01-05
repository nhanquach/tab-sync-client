import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { User } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import { getUser, signUp, signIn, resetPassword } from "./clients";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import { ROUTES } from "./routes";
import Home from "./pages/Home";
import LiveBackground from "./components/LiveBackground";

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getUser().then((userData) => {
      if (userData) {
        setUser(userData);
        if (location.pathname === ROUTES.SIGN_IN || location.pathname === ROUTES.SIGN_UP) {
            navigate(ROUTES.HOME);
        }
      }
      setLoading(false);
    });
  }, []);

  const onSignUp = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await signUp({
      email,
      password,
    });

    return {
      data,
      error: error?.message || "",
    };
  };

  const onSignIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ error: string }> => {
    const { error, data } = await signIn({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    setUser(data.user);
    navigate(ROUTES.HOME);

    return {
      error: "",
    };
  };

  const onResetPassword = async ({ email }: { email: string }) => {
    return await resetPassword({ email });
  };

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#8f94fb",
            dark: "#4e54c8",
          },
          secondary: {
            main: "#696969",
          },
        },
      }),
    [prefersDarkMode]
  );

  const showBackground = location.pathname !== ROUTES.HOME;

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <div className="area w-full">
          {showBackground && <LiveBackground fullHeight />}
          <Routes>
              <Route path={ROUTES.SIGN_IN} element={<SignIn signIn={onSignIn} onResetPassword={onResetPassword} />} />
              <Route path={ROUTES.SIGN_UP} element={<SignUp signUp={onSignUp} />} />
              <Route path={ROUTES.HOME} element={user ? <Home user={user} /> : <Navigate to={ROUTES.SIGN_IN} />} />
              <Route path="*" element={<Navigate to={ROUTES.SIGN_IN} />} />
          </Routes>
        </div>
      </Box>
    </ThemeProvider>
  );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
