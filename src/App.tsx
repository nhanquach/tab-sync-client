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
import LoadingScreen from "./components/LoadingScreen";
import { PALETTE } from "./theme/palette";
import { injectTheme } from "./theme/injectTheme";
import { getItem } from "./utils/LocalStorageHelper";
import { THEMES } from "./theme/definitions";

// Inject theme variables immediately
injectTheme();

// Restore saved theme on load
const savedThemeId = getItem<string>("tabsync_theme_id");
if (savedThemeId) {
  const theme = THEMES.find((t) => t.id === savedThemeId);
  if (theme) {
    const root = document.documentElement;
    root.style.setProperty("--seed-primary-hue", theme.seed.primaryHue.toString());
    root.style.setProperty("--seed-secondary-hue", theme.seed.secondaryHue.toString());
    root.style.setProperty("--seed-tertiary-hue", theme.seed.tertiaryHue.toString());
  }
}

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (prefersDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [prefersDarkMode]);

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

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: PALETTE.primary.main,
            dark: PALETTE.primary.dark,
          },
          secondary: {
            main: PALETTE.secondary.main,
          },
        },
      }),
    [prefersDarkMode]
  );

  const showBackground = !location.pathname.startsWith(ROUTES.HOME);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <CssBaseline />
          <LoadingScreen />
        </Box>
      </ThemeProvider>
    );
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
              <Route path={`${ROUTES.HOME}/:view?/:tabId?`} element={user ? <Home user={user} /> : <Navigate to={ROUTES.SIGN_IN} />} />
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
