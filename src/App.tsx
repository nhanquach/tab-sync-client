import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { User } from "@supabase/supabase-js";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import { getUser, signUp, signIn, resetPassword } from "./clients";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import { ROUTES } from "./routes";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import LoadingHomeShell from "./components/LoadingHomeShell";
import { PALETTE } from "./theme/palette";
import { useAppearance } from "./theme/appearance";

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Light/dark follows the system unless a mode is picked in Settings > Appearance.
  const { isDark } = useAppearance();

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

  // MUI pieces (snackbar, a few layout primitives) use the same neutral tokens as shadcn/Tailwind.
  const theme = React.useMemo(() => {
    const c = isDark ? PALETTE.dark : PALETTE.light;
    return createTheme({
      palette: {
        mode: isDark ? "dark" : "light",
        primary: { main: c.primary, light: c.primaryFill, contrastText: c.primaryContrast },
        secondary: { main: c.muted },
        error: { main: c.error },
        background: { default: c.background, paper: c.paper },
        text: { primary: c.text, secondary: c.muted },
        divider: c.border,
      },
      shape: { borderRadius: 10 },
      shadows: Array(25).fill("none") as never,
      typography: {
        fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: 14,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 600,
        button: { textTransform: "none", fontWeight: 500 },
      },
      components: {
        MuiPaper: { defaultProps: { elevation: 0 } },
        MuiButtonBase: { defaultProps: { disableRipple: true } },
        MuiSnackbarContent: {
          styleOverrides: {
            root: {
              backgroundColor: c.text,
              color: c.background,
              fontSize: 13,
              borderRadius: 8,
              padding: "2px 12px",
              minWidth: 0,
            },
          },
        },
      },
    });
  }, [isDark]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingHomeShell />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
          <Route path={ROUTES.SIGN_IN} element={<SignIn signIn={onSignIn} onResetPassword={onResetPassword} />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp signUp={onSignUp} />} />
          <Route path={`${ROUTES.HOME}/:view?/:tabId?`} element={user ? <Home user={user} /> : <Navigate to={ROUTES.SIGN_IN} />} />
          <Route path={ROUTES.SETTINGS} element={user ? <Settings user={user} /> : <Navigate to={ROUTES.SIGN_IN} />} />
          {/* Password-reset emails land here; open Settings with the change-password form. */}
          <Route path={ROUTES.FORGOT_PASSWORD} element={user ? <Settings user={user} openChangePassword /> : <Navigate to={ROUTES.SIGN_IN} />} />
          <Route path="*" element={<Navigate to={ROUTES.SIGN_IN} />} />
      </Routes>
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
